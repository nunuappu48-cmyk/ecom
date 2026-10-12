import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Sparkles,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Coins,
  Copy,
  Check,
  UploadCloud,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { orderService } from '../services/orderService'
import { cryptoService } from '../services/cryptoService'
import { formatCurrency } from '../utils/formatters'

export const Checkout = () => {
  const { items, subtotal, deliveryFee, discountAmount, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')

  // Live Crypto Settings from cryptoService
  const [cryptoList, setCryptoList] = useState(() =>
    cryptoService.getCryptoSettings().filter(c => c.is_active !== false)
  )

  useEffect(() => {
    const handleUpdate = () => {
      setCryptoList(cryptoService.getCryptoSettings().filter(c => c.is_active !== false))
    }
    window.addEventListener('crypto-settings-updated', handleUpdate)
    return () => window.removeEventListener('crypto-settings-updated', handleUpdate)
  }, [])

  // Crypto State
  const [selectedCrypto, setSelectedCrypto] = useState(() => cryptoList[0]?.id || 'usdt-trc20')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [cryptoProofImage, setCryptoProofImage] = useState(null)
  const [cryptoProofFileName, setCryptoProofFileName] = useState('')
  const [cryptoTxId, setCryptoTxId] = useState('')

  const activeCrypto = cryptoList.find(c => c.id === selectedCrypto) || cryptoList[0]

  // Form State
  const [formData, setFormData] = useState({
    shipping_name: profile?.full_name || '',
    shipping_email: user?.email || profile?.email || '',
    shipping_phone: profile?.phone || '',
    shipping_address: '',
    shipping_city: '',
    shipping_country: 'India',
    shipping_postal_code: '',
    delivery_notes: ''
  })

  // Copy Address Handler
  const handleCopyAddress = (addr) => {
    try {
      navigator.clipboard.writeText(addr)
      setCopiedAddress(true)
      addToast('Deposit address copied to clipboard! 📋', 'success')
      setTimeout(() => setCopiedAddress(false), 3000)
    } catch {
      addToast('Please select and copy address manually', 'info')
    }
  }

  // Screenshot Upload Handler
  const handleProofUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (PNG, JPG, WEBP)', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCryptoProofImage(reader.result)
      setCryptoProofFileName(file.name)
      addToast('Transaction screenshot attached! 📸', 'success')
    }
    reader.onerror = () => {
      addToast('Failed to read image file. Please try again.', 'error')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveProof = () => {
    setCryptoProofImage(null)
    setCryptoProofFileName('')
    addToast('Screenshot removed', 'info')
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4 space-y-4">
        <div className="text-4xl">🍯</div>
        <h2 className="font-serif font-bold text-xl text-amberBrown-950">Your basket is empty</h2>
        <p className="text-xs text-amberBrown-600">Please add honey items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-honey-500 font-bold text-xs rounded-xl text-amberBrown-950"
        >
          Browse Honey Products
        </Link>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.shipping_name || !formData.shipping_email || !formData.shipping_phone || !formData.shipping_address || !formData.shipping_city || !formData.shipping_postal_code) {
      addToast('Please fill in all required delivery fields', 'error')
      return
    }

    if (paymentMethod === 'Cryptocurrency' && !cryptoProofImage) {
      addToast('Please upload a screenshot of your crypto transaction receipt before placing order.', 'error')
      return
    }

    setLoading(true)

    try {
      const selectedCoin = cryptoList.find(c => c.id === selectedCrypto) || cryptoList[0] || { name: 'USDT (TRC-20)' }

      const orderPayload = {
        user_id: user?.id || null,
        subtotal,
        delivery_fee: deliveryFee,
        discount: discountAmount,
        total,
        payment_method: paymentMethod === 'Cryptocurrency' ? `Cryptocurrency (${selectedCoin.name})` : paymentMethod,
        payment_status: paymentMethod === 'Cash on Delivery' ? 'Pending' : (paymentMethod === 'Cryptocurrency' ? 'Pending Verification' : 'Completed'),
        payment_proof: cryptoProofImage || null,
        transaction_id: cryptoTxId.trim() || null,
        crypto_details: paymentMethod === 'Cryptocurrency' ? {
          coin: selectedCoin.name,
          network: selectedCoin.network,
          address: selectedCoin.address,
          txid: cryptoTxId.trim() || null
        } : null,
        ...formData,
        delivery_notes: formData.delivery_notes + (paymentMethod === 'Cryptocurrency' && cryptoTxId ? ` [Crypto TXID: ${cryptoTxId.trim()}]` : '')
      }

      const createdOrder = await orderService.createOrder(orderPayload, items)
      
      // Clear Cart
      clearCart()

      addToast('🍯 Order placed successfully!', 'success')
      navigate(`/order-success/${createdOrder.order_number}`)
    } catch (err) {
      console.error('Order creation error:', err)
      addToast(err.message || 'Failed to place order. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-6 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/cart"
          className="p-2 rounded-xl bg-white border border-honey-200 text-amberBrown-800 hover:bg-honey-100 transition-colors"
          aria-label="Back to Cart"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Secure Checkout
          </h1>
          <p className="text-xs text-amberBrown-500">
            Fast, safe, and all-India doorstep delivery
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shipping & Payment Info */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Contact & Shipping Address Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-honey-200/80 shadow-soft space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-honey-100">
              <div className="w-8 h-8 rounded-xl bg-honey-100 text-honey-800 font-black text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="font-serif font-bold text-lg text-amberBrown-950">
                Delivery Details (India)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="shipping_name"
                    required
                    value={formData.shipping_name}
                    onChange={handleChange}
                    placeholder="e.g. Asim J"
                    className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="shipping_email"
                    required
                    value={formData.shipping_email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  Mobile Number (for delivery SMS / call) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="shipping_phone"
                    required
                    value={formData.shipping_phone}
                    onChange={handleChange}
                    placeholder="+91 85898 66422"
                    className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  Flat / House No. / Building / Street Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="shipping_address"
                    required
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Green Meadows, 12th Main Road"
                    className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  City / Town *
                </label>
                <input
                  type="text"
                  name="shipping_city"
                  required
                  value={formData.shipping_city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, Kochi, Mumbai, Delhi"
                  className="w-full px-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  6-Digit PIN Code *
                </label>
                <input
                  type="text"
                  name="shipping_postal_code"
                  required
                  maxLength={6}
                  value={formData.shipping_postal_code}
                  onChange={handleChange}
                  placeholder="e.g. 560001"
                  className="w-full px-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              {/* Country */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  Country
                </label>
                <input
                  type="text"
                  name="shipping_country"
                  readOnly
                  value="India"
                  className="w-full px-4 py-2.5 bg-cream-100 rounded-xl border border-honey-300 text-amberBrown-900 font-bold focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Delivery Notes */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">
                  Landmark / Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  name="delivery_notes"
                  value={formData.delivery_notes}
                  onChange={handleChange}
                  placeholder="e.g. Near Metro Station, call upon arrival..."
                  className="w-full px-4 py-2 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-honey-200/80 shadow-soft space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-honey-100">
              <div className="w-8 h-8 rounded-xl bg-honey-100 text-honey-800 font-black text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="font-serif font-bold text-lg text-amberBrown-950">
                Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-honey-500 bg-honey-50/70 shadow-honey-sm'
                    : 'border-honey-200 hover:bg-cream-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 accent-honey-600 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amberBrown-950">
                      Cash on Delivery (COD) / Pay on Delivery
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-natureGreen-100 text-natureGreen-800">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-amberBrown-600 mt-0.5">
                    Pay securely with cash or UPI QR code to the delivery executive upon arrival.
                  </p>
                </div>
              </label>

              {/* Online UPI / Cards Payment */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Online Payment'
                    ? 'border-honey-500 bg-honey-50/70 shadow-honey-sm'
                    : 'border-honey-200 hover:bg-cream-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="Online Payment"
                  checked={paymentMethod === 'Online Payment'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 accent-honey-600 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amberBrown-950">
                      UPI (GPay / PhonePe / Paytm) / Cards / Net Banking
                    </span>
                    <span className="text-xs">📱</span>
                  </div>
                  <p className="text-xs text-amberBrown-600 mt-0.5">
                    Instant zero-touch payment gateway sandbox (Demo enabled).
                  </p>
                </div>
              </label>

              {/* Cryptocurrency Payment */}
              <div
                className={`rounded-2xl border transition-all overflow-hidden ${
                  paymentMethod === 'Cryptocurrency'
                    ? 'border-honey-500 bg-honey-50/40 shadow-honey-sm'
                    : 'border-honey-200 hover:bg-cream-50'
                }`}
              >
                <label className="flex items-start gap-3.5 p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="Cryptocurrency"
                    checked={paymentMethod === 'Cryptocurrency'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-honey-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-amberBrown-950">
                          Cryptocurrency (USDT / BTC / ETH / SOL / BNB)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-700" />
                        Web3 Pay
                      </span>
                    </div>
                    <p className="text-xs text-amberBrown-600 mt-0.5">
                      Pay via USDT, Bitcoin, Ethereum, Solana, or BNB and upload your payment transaction screenshot.
                    </p>
                  </div>
                </label>

                {/* Expanded Crypto Details */}
                {paymentMethod === 'Cryptocurrency' && (
                  <div className="px-4 pb-5 pt-1 space-y-4 border-t border-honey-200/70 animate-fadeIn">
                    
                    {/* Coin Selector Pills */}
                    <div>
                      <label className="block text-xs font-bold text-amberBrown-900 mb-2">
                        Select Cryptocurrency & Network:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {cryptoList.map((coin) => (
                          <button
                            type="button"
                            key={coin.id}
                            onClick={() => setSelectedCrypto(coin.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                              selectedCrypto === coin.id
                                ? 'border-amberBrown-900 bg-white shadow-xs ring-2 ring-honey-500'
                                : 'border-honey-200 bg-cream-50/80 hover:bg-white text-amberBrown-700'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${coin.iconColor}`}>
                              {coin.symbol.slice(0, 3)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-amberBrown-950 truncate">{coin.name}</p>
                              <p className="text-[10px] text-amberBrown-500 truncate">{coin.network}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deposit Address Box with QR Code */}
                    {activeCrypto && (
                      <div className="bg-white rounded-2xl p-4 border border-honey-300 shadow-soft-sm space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          
                          {/* QR Code */}
                          <div className="shrink-0 p-2 bg-cream-50 border border-honey-200 rounded-xl shadow-2xs text-center">
                            <img
                              src={
                                activeCrypto.qr_image ||
                                `https://api.qrserver.com/v1/create-qr-code/?size=130x130&margin=2&data=${encodeURIComponent(
                                  activeCrypto.address || ''
                                )}`
                              }
                              alt={`${activeCrypto.name} QR`}
                              className="w-28 h-28 object-contain rounded-lg mx-auto"
                              loading="lazy"
                            />
                            <span className="text-[10px] font-bold text-amberBrown-500 block mt-1">Scan & Pay</span>
                          </div>

                          {/* Address & Copy Details */}
                          <div className="flex-1 space-y-2 min-w-0 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-honey-800">
                                {activeCrypto.network} Deposit Address
                              </span>
                              <span className="text-[11px] text-amberBrown-500">{activeCrypto.note}</span>
                            </div>

                            <div className="p-2.5 bg-cream-100 rounded-xl border border-honey-200 font-mono text-xs text-amberBrown-950 break-all select-all flex items-center justify-between gap-2">
                              <span>{activeCrypto.address}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyAddress(activeCrypto.address)}
                              className="w-full py-2 px-3 bg-amberBrown-900 hover:bg-amberBrown-950 text-honey-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-98"
                            >
                              {copiedAddress ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-natureGreen-400" />
                                  <span>Address Copied to Clipboard!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy {activeCrypto.symbol} Address</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="bg-honey-100/60 p-2.5 rounded-xl text-[11px] text-amberBrown-800 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-honey-700 shrink-0 mt-0.5" />
                          <span>
                            Send exactly the order equivalent to this address on the <strong>{activeCrypto.network}</strong> network. After sending, upload the transaction receipt screenshot below.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Screenshot / Proof Upload Section */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-amberBrown-950">
                        Upload Transaction Screenshot / Receipt *
                      </label>

                      {!cryptoProofImage ? (
                        <div className="border-2 border-dashed border-honey-300 hover:border-honey-500 bg-white rounded-2xl p-5 text-center transition-colors">
                          <input
                            type="file"
                            id="crypto-proof-input"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleProofUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="crypto-proof-input"
                            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                          >
                            <div className="w-10 h-10 rounded-2xl bg-honey-100 text-honey-800 flex items-center justify-center">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-amberBrown-950">
                                Click to upload transfer screenshot
                              </p>
                              <p className="text-[11px] text-amberBrown-500">
                                PNG, JPG, or WEBP (Max 5MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl p-3 border border-honey-300 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={cryptoProofImage}
                              alt="Payment proof preview"
                              className="w-12 h-12 object-cover rounded-xl border border-honey-200 shrink-0 bg-honey-50"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-amberBrown-950 truncate">
                                {cryptoProofFileName || 'Transaction Screenshot'}
                              </p>
                              <p className="text-[10px] text-natureGreen-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Screenshot attached ready for verification
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveProof}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                            title="Remove screenshot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Optional TXID / Reference Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-amberBrown-900">
                        Transaction Hash / TXID (Optional)
                      </label>
                      <input
                        type="text"
                        value={cryptoTxId}
                        onChange={(e) => setCryptoTxId(e.target.value)}
                        placeholder="e.g. 0x8f2d... or Tron TXID"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-honey-300 text-xs text-amberBrown-900 font-mono focus:outline-none focus:ring-2 focus:ring-honey-500"
                      />
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-honey-200/80 shadow-soft space-y-5 sticky top-24">
            
            <h3 className="font-serif font-bold text-lg text-amberBrown-950 pb-3 border-b border-honey-100">
              Your Order ({items.length} items)
            </h3>

            {/* Item summary snippets */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-honey-100">
              {items.map(item => (
                <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-honey-50 border border-honey-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-amberBrown-950 truncate max-w-[150px]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-amberBrown-500 font-medium">
                        Qty: {item.quantity} × {item.weight}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amberBrown-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-honey-200 space-y-2 text-xs sm:text-sm text-amberBrown-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-amberBrown-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-natureGreen-700 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-amberBrown-900">
                  {deliveryFee === 0 ? <span className="text-natureGreen-700 font-bold">FREE</span> : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-honey-200 flex justify-between items-baseline font-black text-amberBrown-950">
                <span className="text-sm sm:text-base">Total Due</span>
                <span className="text-2xl text-honey-700">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-sm rounded-2xl shadow-honey-md flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-75"
            >
              {loading ? (
                <span>Placing Your Order... 🍯</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • {formatCurrency(total)}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-amberBrown-500 font-medium">
              By placing your order, you agree to Fellas Honey terms of service and harvest delivery guarantee.
            </p>

          </div>
        </div>

      </form>

    </div>
  )
}
