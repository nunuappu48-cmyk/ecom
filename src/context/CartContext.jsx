import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ToastContext'

const CartContext = createContext(null)
const LOCAL_CART_KEY = 'fellas_honey_cart_v1'

const FREE_SHIPPING_THRESHOLD = 499.0
const STANDARD_DELIVERY_FEE = 49.0

export const CartProvider = ({ children }) => {
  const { addToast } = useToast()
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [items])

  const addToCart = (product, quantity = 1, selectedWeight = null) => {
    const weight = selectedWeight || product.weight || '500g'
    // Unique item key based on product ID + weight
    const cartItemId = `${product.id}-${weight}`

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId)
      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex].quantity += quantity
        return updated
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            product_id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            weight: weight,
            image_url: product.image_url,
            quantity: quantity
          }
        ]
      }
    })

    addToast(`🍯 ${product.name} (${weight}) added to your cart!`, 'success')
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
    addToast('Item removed from cart', 'info')
  }

  const clearCart = () => {
    setItems([])
    setCouponCode('')
    setDiscountPercent(0)
  }

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase()
    if (clean === 'HONEY10' || clean === 'FELLAS10') {
      setCouponCode(clean)
      setDiscountPercent(10)
      addToast('🎉 10% Discount Applied!', 'success')
      return { success: true, message: '10% discount applied successfully!' }
    } else if (clean === 'SWEET20') {
      setCouponCode(clean)
      setDiscountPercent(20)
      addToast('🎉 20% VIP Honey Discount Applied!', 'success')
      return { success: true, message: '20% discount applied successfully!' }
    } else {
      addToast('Invalid promo code. Try HONEY10', 'error')
      return { success: false, message: 'Invalid promo code' }
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setDiscountPercent(0)
    addToast('Coupon removed', 'info')
  }

  // Calculated properties
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2))
  const deliveryFee = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
  const total = Math.max(0, subtotal + deliveryFee - discountAmount)
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        discountAmount,
        discountPercent,
        couponCode,
        deliveryFee,
        total,
        freeShippingProgress,
        amountNeededForFreeShipping,
        FREE_SHIPPING_THRESHOLD,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
