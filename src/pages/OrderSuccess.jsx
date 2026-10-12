import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { CheckCircle2, PackageCheck, Truck, Home, ArrowRight, Printer, Sparkles, MapPin, Mail, Phone } from 'lucide-react'
import { orderService } from '../services/orderService'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatCurrency, formatDate } from '../utils/formatters'
import { HoneycombPattern } from '../components/HoneyDecoration'

export const OrderSuccess = () => {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F4B400', '#B7791F', '#6B8E23', '#FFD54F', '#3E2723']
      })
    } catch (e) {
      console.warn('Confetti effect ignored:', e)
    }

    const fetchOrder = async () => {
      try {
        const ord = await orderService.getOrderByNumber(orderNumber)
        setOrder(ord)
      } catch (err) {
        console.error('Error fetching order receipt:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Generating your golden honey receipt..." />
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      
      {/* Celebration Card */}
      <div className="relative bg-amber-gold-gradient rounded-[2.5rem] p-6 sm:p-10 shadow-honey-lg text-center overflow-hidden border border-honey-300">
        <HoneycombPattern className="text-amberBrown-900 opacity-10" />

        <div className="relative z-10 space-y-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl flex items-center justify-center text-3xl sm:text-4xl mx-auto shadow-honey-md">
            🍯
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-natureGreen-800 text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-natureGreen-700" />
            <span>Order Placed Successfully</span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950">
            Thank You for Your Order! 🍯
          </h1>

          <p className="text-xs sm:text-sm text-amberBrown-900/90 font-medium max-w-md mx-auto leading-relaxed">
            We are preparing your fresh artisanal honey straight from the apiary hives. A receipt confirmation has been sent to your email.
          </p>

          <div className="pt-2 inline-block">
            <span className="px-4 py-2 bg-amberBrown-900 text-honey-200 font-mono font-bold text-xs sm:text-sm rounded-xl tracking-wider">
              Order #{order?.order_number || orderNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-honey-200/80 shadow-soft space-y-6">
          
          {/* Status & Estimated Delivery */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-honey-100 gap-2">
            <div>
              <p className="text-xs text-amberBrown-500">Order Placed On</p>
              <p className="text-sm font-bold text-amberBrown-950">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-honey-100 text-honey-800 border border-honey-300">
                <Truck className="w-3.5 h-3.5" />
                Status: {order.status || 'Pending Delivery'}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-cream-50 p-4 rounded-2xl border border-honey-200">
            <div>
              <h3 className="font-bold text-amberBrown-950 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-honey-600" />
                Shipping Destination
              </h3>
              <p className="font-semibold text-amberBrown-900">{order.shipping_name}</p>
              <p className="text-amberBrown-600">{order.shipping_address}</p>
              <p className="text-amberBrown-600">{order.shipping_city}, {order.shipping_postal_code}</p>
              <p className="text-amberBrown-600">{order.shipping_country}</p>
            </div>

            <div>
              <h3 className="font-bold text-amberBrown-950 mb-1">Payment Information</h3>
              <p className="text-amberBrown-900 font-semibold">{order.payment_method}</p>
              <p className="text-amberBrown-600">Status: <strong className="text-honey-700">{order.payment_status}</strong></p>
              {order.transaction_id && (
                <p className="text-amberBrown-600 font-mono text-[11px] truncate max-w-xs mt-0.5">
                  TXID: {order.transaction_id}
                </p>
              )}
              {order.payment_proof && (
                <div className="mt-2 pt-2 border-t border-honey-200 flex items-center gap-2">
                  <img
                    src={order.payment_proof}
                    alt="Uploaded Crypto Proof"
                    className="w-9 h-9 rounded-lg object-cover border border-honey-300 shadow-2xs"
                  />
                  <span className="text-[11px] font-bold text-natureGreen-700">
                    Payment receipt verified & attached ✓
                  </span>
                </div>
              )}
              <p className="text-amberBrown-600 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-honey-600" /> {order.shipping_phone}
              </p>
              <p className="text-amberBrown-600 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-honey-600" /> {order.shipping_email}
              </p>
            </div>
          </div>

          {/* Itemized Products */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-amberBrown-950">
              Ordered Products
            </h3>
            <div className="divide-y divide-honey-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product_name}
                      className="w-12 h-12 rounded-xl object-cover bg-honey-50 border border-honey-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amberBrown-950">
                        {item.product_name}
                      </h4>
                      <p className="text-[11px] text-amberBrown-500">
                        Qty: {item.quantity} • {item.weight || '500g'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-amberBrown-950">
                    {formatCurrency(item.subtotal || item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-honey-200 space-y-2 text-xs sm:text-sm text-amberBrown-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-amberBrown-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-natureGreen-700 font-bold">
                <span>Discount Applied</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-amberBrown-900">
                {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
              </span>
            </div>
            <div className="pt-3 border-t border-honey-200 flex justify-between items-baseline font-black text-amberBrown-950">
              <span className="text-base">Grand Total</span>
              <span className="text-2xl text-honey-700">{formatCurrency(order.total)}</span>
            </div>
          </div>

        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Link
          to="/products"
          className="w-full sm:w-auto px-8 py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs sm:text-sm rounded-2xl shadow-honey-md transition-all active:scale-95 text-center flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/account"
          className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-honey-50 border border-honey-300 text-amberBrown-900 font-bold text-xs sm:text-sm rounded-2xl transition-colors text-center"
        >
          View in My Account
        </Link>
      </div>

    </div>
  )
}
