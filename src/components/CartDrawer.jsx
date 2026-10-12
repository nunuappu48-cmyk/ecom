import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatters'

export const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null

  const handleCheckoutClick = () => {
    setIsCartOpen(false)
    navigate('/checkout')
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon)
      setInputCoupon('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-amberBrown-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-100 shadow-2xl flex flex-col justify-between border-l border-honey-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-honey-200/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-honey-100 text-honey-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-amberBrown-900 leading-tight">Your Honey Basket</h2>
                <p className="text-xs text-amberBrown-500 font-medium">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-amberBrown-500 hover:bg-honey-100 hover:text-amberBrown-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-honey-100/70 p-3 sm:px-5 border-b border-honey-200 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-amberBrown-800 font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-honey-600" />
                Add <span className="font-bold text-honey-700">{formatCurrency(amountNeededForFreeShipping)}</span> more for <span className="text-natureGreen-700 font-bold uppercase">FREE Shipping</span>!
              </p>
            ) : (
              <p className="text-natureGreen-700 font-bold mb-1.5 flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked FREE Express Delivery!
              </p>
            )}
            <div className="w-full bg-honey-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-gold-gradient h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-honey-200/50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-honey-100 flex items-center justify-center text-4xl shadow-inner">
                  🍯
                </div>
                <div>
                  <h3 className="font-bold text-lg text-amberBrown-900">Your basket is empty</h3>
                  <p className="text-xs text-amberBrown-600 mt-1 max-w-xs">
                    Discover our rare wildflower, raw organic mountain, and infused honeys straight from our hives.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    navigate('/products')
                  }}
                  className="px-6 py-2.5 bg-honey-500 hover:bg-honey-600 text-amberBrown-950 font-bold text-xs rounded-xl shadow-honey-sm transition-transform active:scale-95"
                >
                  Explore Honey Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3.5 items-start">
                  <Link
                    to={`/products/${item.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-honey-50 border border-honey-200 flex-shrink-0"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/products/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-bold text-sm text-amberBrown-900 hover:text-honey-700 truncate"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1 text-amberBrown-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-amberBrown-500 bg-honey-100 px-2 py-0.5 rounded-md">
                        {item.weight}
                      </span>
                      <span className="text-xs font-bold text-amberBrown-900">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-honey-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-honey-100 text-amberBrown-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-amberBrown-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-honey-100 text-amberBrown-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-honey-700">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-honey-200 shadow-soft space-y-3">
              
              {/* Promo code input */}
              {couponCode ? (
                <div className="flex items-center justify-between bg-honey-50 border border-honey-300 rounded-xl px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-honey-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:text-red-800 text-[11px] font-bold"
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
                    placeholder="Promo code (try HONEY10)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-honey-300 bg-cream-50 focus:outline-none focus:ring-1 focus:ring-honey-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-honey-200 hover:bg-honey-300 text-amberBrown-900 font-bold text-xs rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-amberBrown-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-amberBrown-900">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-natureGreen-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-amberBrown-900">
                    {deliveryFee === 0 ? <span className="text-natureGreen-700 font-bold uppercase">Free</span> : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-honey-200 flex justify-between text-sm font-black text-amberBrown-950">
                  <span>Total</span>
                  <span className="text-honey-700 text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-sm rounded-2xl shadow-honey-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-center text-xs font-bold text-amberBrown-600 hover:text-amberBrown-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
