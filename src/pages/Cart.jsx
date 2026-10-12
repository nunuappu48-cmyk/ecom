import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatters'

export const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discountAmount,
    couponCode,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
    applyCoupon,
    removeCoupon
  } = useCart()

  const [inputCoupon, setInputCoupon] = useState('')
  const navigate = useNavigate()

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon)
      setInputCoupon('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-honey-100 flex items-center justify-center text-5xl mx-auto shadow-inner">
          🍯
        </div>
        <div className="space-y-2">
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Your Honey Basket is Empty
          </h1>
          <p className="text-xs sm:text-sm text-amberBrown-600 max-w-sm mx-auto">
            Looks like you haven't added any raw artisanal honey to your basket yet.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-sm rounded-2xl shadow-honey-md transition-all active:scale-95"
        >
          <span>Explore Honey Reserves</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950">
          Shopping Basket
        </h1>
        <p className="text-xs sm:text-sm text-amberBrown-600 mt-1">
          Review your selected artisanal honeys and proceed to secure checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Banner */}
          <div className="bg-white rounded-2xl p-4 border border-honey-200 shadow-2xs space-y-2">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-xs text-amberBrown-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-honey-600" />
                Add <span className="font-bold text-honey-700">{formatCurrency(amountNeededForFreeShipping)}</span> more for <span className="text-natureGreen-700 font-bold uppercase">FREE Shipping</span>!
              </p>
            ) : (
              <p className="text-xs text-natureGreen-700 font-bold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked FREE Express Delivery!
              </p>
            )}
            <div className="w-full bg-honey-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-gold-gradient h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-honey-200/80 shadow-soft p-4 sm:p-6 divide-y divide-honey-100">
            {items.map((item) => (
              <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                <Link
                  to={`/products/${item.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-cream-50 border border-honey-200 flex-shrink-0"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/products/${item.slug}`}
                        className="font-serif font-bold text-sm sm:text-base text-amberBrown-950 hover:text-honey-700 truncate block"
                      >
                        {item.name}
                      </Link>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-honey-100 text-amberBrown-800 text-[11px] font-bold">
                        {item.weight}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 text-amberBrown-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-honey-300 rounded-xl bg-cream-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 hover:bg-honey-100 text-amberBrown-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-amberBrown-900 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 hover:bg-honey-100 text-amberBrown-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-black text-sm sm:text-base text-amberBrown-950">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <span className="block text-[10px] text-amberBrown-400 font-medium">
                        {formatCurrency(item.price)} each
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs font-bold text-amberBrown-700 hover:text-honey-700 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-honey-200/80 shadow-soft p-5 sm:p-6 space-y-5">
            
            <h2 className="font-serif font-bold text-lg text-amberBrown-950 pb-3 border-b border-honey-100">
              Order Summary
            </h2>

            {/* Promo Code Box */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-honey-50 border border-honey-300 rounded-2xl px-3.5 py-2 text-xs">
                <div className="flex items-center gap-2 text-honey-800 font-bold">
                  <Tag className="w-4 h-4 text-honey-600" />
                  <span>Coupon {couponCode}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:text-red-800 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Promo code (HONEY10)"
                  className="flex-1 px-3.5 py-2.5 bg-cream-50 border border-honey-300 rounded-xl text-xs uppercase font-semibold text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-honey-200 hover:bg-honey-300 text-amberBrown-900 font-bold text-xs rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-amberBrown-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-amberBrown-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-natureGreen-700 font-bold">
                  <span>Promo Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-amberBrown-900">
                  {deliveryFee === 0 ? <span className="text-natureGreen-700 font-bold uppercase">Free</span> : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-honey-200 flex justify-between items-baseline font-black text-amberBrown-950">
                <span className="text-base">Estimated Total</span>
                <span className="text-xl text-honey-700">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-sm rounded-2xl shadow-honey-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-amberBrown-500 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-natureGreen-600" />
              <span>Safe & Secure Encrypted Checkout</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
