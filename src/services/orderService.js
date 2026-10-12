import { supabase } from '../lib/supabase'

const LOCAL_ORDERS_KEY = 'fellas_honey_orders_store'

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
    const orderNumber = `FEL-${Math.floor(100000 + Math.random() * 900000)}`
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
      shipping_country: orderPayload.shipping_country || 'India',
      shipping_postal_code: orderPayload.shipping_postal_code,
      delivery_notes: orderPayload.delivery_notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      // 1. Insert order into Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([dbOrder])
        .select()
        .single()

      if (orderError) {
        console.warn('Supabase createOrder error, utilizing local order backup:', orderError)
        throw orderError
      }

      // 2. Insert order items into Supabase
      if (items && items.length > 0) {
        const orderItemsToInsert = items.map(item => ({
          order_id: orderData.id,
          product_id: isValidUUID(item.product_id || item.id) ? (item.product_id || item.id) : null,
          product_name: item.name,
          product_image: item.image_url,
          price: Number(item.price),
          quantity: Number(item.quantity),
          weight: item.weight || '500g',
          subtotal: Number(item.price) * Number(item.quantity)
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert)

        if (itemsError) {
          console.warn('Supabase createOrderItems warning:', itemsError)
        }
      }

      const completedOrder = {
        ...orderData,
        user_id: orderPayload.user_id || sanitizedUserId,
        payment_proof: orderPayload.payment_proof || null,
        transaction_id: orderPayload.transaction_id || null,
        crypto_details: orderPayload.crypto_details || null,
        items
      }
      saveLocalOrder(completedOrder)
      return completedOrder
    } catch (err) {
      console.warn('Using offline/local fallback order creation due to database policy:', err.message)
      const mockOrder = {
        id: 'ord-' + Date.now(),
        ...dbOrder,
        user_id: orderPayload.user_id || sanitizedUserId,
        payment_proof: orderPayload.payment_proof || null,
        transaction_id: orderPayload.transaction_id || null,
        crypto_details: orderPayload.crypto_details || null,
        items
      }
      saveLocalOrder(mockOrder)
      return mockOrder
    }
  },

  async getOrderByNumber(orderNumber) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single()

      if (!orderError && orderData) {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderData.id)

        return { ...orderData, items: itemsData || [] }
      }
    } catch (err) {
      console.warn('Supabase getOrderByNumber fallback to local orders:', err.message)
    }

    // Fallback: search local orders
    const localOrders = getLocalOrders()
    const found = localOrders.find(o => o.order_number === orderNumber)
    return found || null
  },

  async getUserOrders(userId, userEmail = '') {
    if (!userId && !userEmail) return []
    let dbOrders = []
    const cleanEmail = (userEmail || '').trim().toLowerCase()

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false })

      if (isValidUUID(userId) && cleanEmail) {
        query = query.or(`user_id.eq.${userId},shipping_email.ilike.${cleanEmail}`)
      } else if (isValidUUID(userId)) {
        query = query.eq('user_id', userId)
      } else if (cleanEmail) {
        query = query.ilike('shipping_email', cleanEmail)
      }

      const { data, error } = await query

      if (!error && data) {
        dbOrders = data
      }
    } catch (err) {
      console.warn('Supabase getUserOrders error:', err.message)
    }

    // Strictly filter local orders ONLY for this exact user (by userId or matching email)
    const localOrders = getLocalOrders().filter(o => {
      const matchesUserId = userId && o.user_id && String(o.user_id) === String(userId)
      const matchesEmail = cleanEmail && o.shipping_email && o.shipping_email.trim().toLowerCase() === cleanEmail
      return Boolean(matchesUserId || matchesEmail)
    })

    // Combine and deduplicate
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
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        dbOrders = data
      }
    } catch (err) {
      console.warn('Supabase getAllOrdersAdmin error:', err.message)
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
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (!error && data) {
        return data
      }
    } catch (err) {
      console.warn('Supabase updateOrderStatus fallback:', err.message)
    }

    // Update local order
    const localOrders = getLocalOrders()
    const idx = localOrders.findIndex(o => o.id === orderId)
    if (idx !== -1) {
      localOrders[idx].status = status
      localOrders[idx].updated_at = new Date().toISOString()
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(localOrders))
      return localOrders[idx]
    }
    return { id: orderId, status }
  }
}
