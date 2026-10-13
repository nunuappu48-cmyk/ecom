import { neonSql } from '../lib/neon'

const LOCAL_ORDERS_KEY = 'ecomcenter_orders_store'

const isValidUUID = (id) => {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveLocalOrder = (order) => {
  try {
    const orders = getLocalOrders()
    orders.unshift(order)
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
  } catch (err) {
    console.warn('Failed to save order to localStorage:', err)
  }
}

export const orderService = {
  async createOrder(orderPayload, items = []) {
    const orderNumber = `ECM-${Math.floor(100000 + Math.random() * 900000)}`
    const sanitizedUserId = isValidUUID(orderPayload.user_id) ? orderPayload.user_id : null

    const dbOrder = {
      user_id: sanitizedUserId,
      order_number: orderNumber,
      subtotal: Number(orderPayload.subtotal || 0),
      delivery_fee: Number(orderPayload.delivery_fee || 0),
      discount: Number(orderPayload.discount || 0),
      total: Number(orderPayload.total || 0),
      payment_method: orderPayload.payment_method || 'Cash on Delivery',
      payment_status: orderPayload.payment_status || 'Pending',
      status: 'Pending',
      shipping_name: orderPayload.shipping_name,
      shipping_phone: orderPayload.shipping_phone,
      shipping_email: orderPayload.shipping_email,
      shipping_address: orderPayload.shipping_address,
      shipping_city: orderPayload.shipping_city,
      shipping_country: orderPayload.shipping_country || 'United States',
      shipping_postal_code: orderPayload.shipping_postal_code,
      delivery_notes: orderPayload.delivery_notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    let createdOrder = null

    if (neonSql) {
      try {
        const [inserted] = await neonSql`
          INSERT INTO public.orders (
            user_id, order_number, subtotal, delivery_fee, discount, total,
            payment_method, payment_status, status, shipping_name, shipping_phone,
            shipping_email, shipping_address, shipping_city, shipping_country,
            shipping_postal_code, delivery_notes
          ) VALUES (
            ${dbOrder.user_id},
            ${dbOrder.order_number},
            ${dbOrder.subtotal},
            ${dbOrder.delivery_fee},
            ${dbOrder.discount},
            ${dbOrder.total},
            ${dbOrder.payment_method},
            ${dbOrder.payment_status},
            ${dbOrder.status},
            ${dbOrder.shipping_name},
            ${dbOrder.shipping_phone},
            ${dbOrder.shipping_email},
            ${dbOrder.shipping_address},
            ${dbOrder.shipping_city},
            ${dbOrder.shipping_country},
            ${dbOrder.shipping_postal_code},
            ${dbOrder.delivery_notes}
          )
          RETURNING *
        `

        if (inserted) {
          createdOrder = inserted
          // Insert order items
          if (items && items.length > 0) {
            for (const item of items) {
              const pid = isValidUUID(item.product_id || item.id) ? (item.product_id || item.id) : null
              await neonSql`
                INSERT INTO public.order_items (
                  order_id, product_id, product_name, product_image, price, quantity, weight, subtotal
                ) VALUES (
                  ${inserted.id},
                  ${pid},
                  ${item.name},
                  ${item.image_url || null},
                  ${Number(item.price)},
                  ${Number(item.quantity)},
                  ${item.weight || 'Standard'},
                  ${Number(item.price) * Number(item.quantity)}
                )
              `
            }
          }
        }
      } catch (neonErr) {
        console.warn('Neon order creation error, using local backup:', neonErr.message)
      }
    }

    const completedOrder = {
      id: createdOrder?.id || `ord-${Date.now()}`,
      ...dbOrder,
      user_id: orderPayload.user_id || sanitizedUserId,
      payment_proof: orderPayload.payment_proof || null,
      transaction_id: orderPayload.transaction_id || null,
      crypto_details: orderPayload.crypto_details || null,
      items
    }

    saveLocalOrder(completedOrder)
    return completedOrder
  },

  async getOrderByNumber(orderNumber) {
    if (neonSql) {
      try {
        const rows = await neonSql`SELECT * FROM public.orders WHERE order_number = ${orderNumber} LIMIT 1`
        if (rows && rows.length > 0) {
          const items = await neonSql`SELECT * FROM public.order_items WHERE order_id = ${rows[0].id}`
          return { ...rows[0], items: items || [] }
        }
      } catch (err) {
        console.warn('Neon getOrderByNumber warning:', err.message)
      }
    }

    const localOrders = getLocalOrders()
    return localOrders.find(o => o.order_number === orderNumber) || null
  },

  async getUserOrders(userId, userEmail = '') {
    if (!userId && !userEmail) return []
    let dbOrders = []
    const cleanEmail = (userEmail || '').trim().toLowerCase()

    if (neonSql) {
      try {
        let rows = []
        if (isValidUUID(userId) && cleanEmail) {
          rows = await neonSql`SELECT * FROM public.orders WHERE user_id = ${userId} OR LOWER(shipping_email) = ${cleanEmail} ORDER BY created_at DESC`
        } else if (isValidUUID(userId)) {
          rows = await neonSql`SELECT * FROM public.orders WHERE user_id = ${userId} ORDER BY created_at DESC`
        } else if (cleanEmail) {
          rows = await neonSql`SELECT * FROM public.orders WHERE LOWER(shipping_email) = ${cleanEmail} ORDER BY created_at DESC`
        }

        if (Array.isArray(rows) && rows.length > 0) {
          for (let ord of rows) {
            const itms = await neonSql`SELECT * FROM public.order_items WHERE order_id = ${ord.id}`
            ord.items = itms || []
          }
          dbOrders = rows
        }
      } catch (err) {
        console.warn('Neon getUserOrders error:', err.message)
      }
    }

    const localOrders = getLocalOrders().filter(o => {
      const matchesUserId = userId && o.user_id && String(o.user_id) === String(userId)
      const matchesEmail = cleanEmail && o.shipping_email && o.shipping_email.trim().toLowerCase() === cleanEmail
      return Boolean(matchesUserId || matchesEmail)
    })

    const all = [...dbOrders]
    for (const loc of localOrders) {
      if (!all.some(o => o.order_number === loc.order_number)) {
        all.push(loc)
      }
    }
    return all
  },

  async getAllOrdersAdmin() {
    let dbOrders = []
    if (neonSql) {
      try {
        const rows = await neonSql`SELECT * FROM public.orders ORDER BY created_at DESC`
        if (Array.isArray(rows) && rows.length > 0) {
          for (let ord of rows) {
            const itms = await neonSql`SELECT * FROM public.order_items WHERE order_id = ${ord.id}`
            ord.items = itms || []
          }
          dbOrders = rows
        }
      } catch (err) {
        console.warn('Neon getAllOrdersAdmin error:', err.message)
      }
    }

    const localOrders = getLocalOrders()
    const all = [...dbOrders]
    for (const loc of localOrders) {
      if (!all.some(o => o.order_number === loc.order_number)) {
        all.push(loc)
      }
    }
    return all
  },

  async updateOrderStatus(orderId, status) {
    if (neonSql) {
      try {
        await neonSql`UPDATE public.orders SET status = ${status}, updated_at = now() WHERE id::text = ${orderId} OR order_number = ${orderId}`
      } catch (err) {
        console.warn('Neon updateOrderStatus error:', err.message)
      }
    }

    const localOrders = getLocalOrders()
    const idx = localOrders.findIndex(o => o.id === orderId || o.order_number === orderId)
    if (idx !== -1) {
      localOrders[idx].status = status
      localOrders[idx].updated_at = new Date().toISOString()
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(localOrders))
      return localOrders[idx]
    }
    return { id: orderId, status }
  }
}
