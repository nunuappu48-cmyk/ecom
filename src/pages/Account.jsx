import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User,
  Package,
  Clock,
  MapPin,
  LogOut,
  Edit3,
  Save,
  ShieldCheck,
  Truck,
  Eye,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { orderService } from '../services/orderService'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatCurrency, formatDate } from '../utils/formatters'

export const Account = () => {
  const { user, profile, isAdmin, updateProfile, signOut } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [nameInput, setNameInput] = useState(profile?.full_name || '')
  const [phoneInput, setPhoneInput] = useState(profile?.phone || '')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    setNameInput(profile?.full_name || '')
    setPhoneInput(profile?.phone || '')

    const fetchUserOrders = async () => {
      try {
        const data = await orderService.getUserOrders(user.id, user.email || profile?.email)
        setOrders(data)
      } catch (err) {
        console.error('Error fetching user orders:', err)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchUserOrders()
  }, [user, profile, navigate])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile({
        full_name: nameInput,
        phone: phoneInput
      })
      setEditingProfile(false)
      addToast('Profile updated successfully! ✨', 'success')
    } catch (err) {
      addToast('Failed to update profile.', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    addToast('Signed out successfully. See you soon! 🍯', 'info')
    navigate('/')
  }

  return (
    <div className="py-6 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Profile Greeting Card */}
      <div className="bg-gradient-to-r from-honey-100 via-cream-100 to-honey-200/90 rounded-3xl p-6 sm:p-8 border border-honey-300 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-gold-gradient text-amberBrown-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-honey-sm">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-xl sm:text-3xl text-amberBrown-950">
                {profile?.full_name || 'Honey Connoisseur'}
              </h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-amberBrown-700">{user?.email}</p>
            <p className="text-[11px] text-natureGreen-700 font-bold mt-1">
              🍯 Honey Club Tier: Pure Raw Member
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-amberBrown-900 text-honey-200 font-bold text-xs rounded-xl shadow-sm hover:bg-amberBrown-950 transition-colors text-center"
            >
              Go to Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Profile Info / Edit Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-honey-100">
            <h2 className="font-serif font-bold text-lg text-amberBrown-950 flex items-center gap-2">
              <User className="w-4 h-4 text-honey-600" />
              <span>Personal Details</span>
            </h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="text-xs font-bold text-honey-700 hover:text-amberBrown-900 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {editingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block font-bold text-amberBrown-900">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-50 border border-honey-300 rounded-xl text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-amberBrown-900">Phone</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 85898 66422"
                  className="w-full px-3 py-2 bg-cream-50 border border-honey-300 rounded-xl text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 bg-honey-500 hover:bg-honey-600 text-amberBrown-950 font-bold text-xs rounded-xl shadow-honey-sm flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-amberBrown-700">
              <div>
                <p className="text-[11px] text-amberBrown-400 font-semibold uppercase">Full Name</p>
                <p className="font-bold text-amberBrown-950">{profile?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[11px] text-amberBrown-400 font-semibold uppercase">Email Address</p>
                <p className="font-bold text-amberBrown-950">{user?.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-amberBrown-400 font-semibold uppercase">Phone Number</p>
                <p className="font-bold text-amberBrown-950">{profile?.phone || 'Not added yet'}</p>
              </div>
              <div>
                <p className="text-[11px] text-amberBrown-400 font-semibold uppercase">Account Role</p>
                <p className="font-bold capitalize text-honey-700">{profile?.role || 'Customer'}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right: Order History */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-honey-200/80 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-honey-100">
            <h2 className="font-serif font-bold text-lg text-amberBrown-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-honey-600" />
              <span>Order History ({orders.length})</span>
            </h2>
            <Link
              to="/products"
              className="text-xs font-bold text-honey-700 hover:underline"
            >
              Shop New Honey
            </Link>
          </div>

          {loadingOrders ? (
            <LoadingSpinner text="Retrieving past orders..." />
          ) : orders.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="text-4xl">📦</div>
              <h3 className="font-bold text-sm text-amberBrown-900">No orders placed yet</h3>
              <p className="text-xs text-amberBrown-600 max-w-xs mx-auto">
                Once you order raw honey from Fellas Honey, your receipts and tracking updates will appear right here.
              </p>
              <Link
                to="/products"
                className="inline-block px-5 py-2.5 bg-amber-gold-gradient text-amberBrown-950 font-bold text-xs rounded-xl shadow-honey-sm"
              >
                Browse Honey Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-cream-50/70 rounded-2xl p-4 sm:p-5 border border-honey-200 hover:border-honey-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-xs sm:text-sm text-amberBrown-950">
                        {order.order_number}
                      </span>
                      <p className="text-[11px] text-amberBrown-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-natureGreen-100 text-natureGreen-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-honey-100 text-honey-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-white hover:bg-honey-100 text-amberBrown-800 rounded-lg border border-honey-200 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="pt-2 border-t border-honey-200/60 flex items-center justify-between text-xs">
                    <span className="text-amberBrown-600">
                      {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'} ({order.payment_method})
                    </span>
                    <span className="font-serif font-black text-sm text-honey-800">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amberBrown-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-honey-300 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-honey-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-amberBrown-950">
                  Order #{selectedOrder.order_number}
                </h3>
                <p className="text-xs text-amberBrown-500">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-amberBrown-400 hover:text-amberBrown-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shipping & Payment Info */}
            <div className="bg-cream-50 p-3.5 rounded-2xl text-xs space-y-1.5 text-amberBrown-700 border border-honey-200">
              <p className="font-bold text-amberBrown-900">Recipient: {selectedOrder.shipping_name}</p>
              <p>{selectedOrder.shipping_address}, {selectedOrder.shipping_city} {selectedOrder.shipping_postal_code}</p>
              <p>Phone: {selectedOrder.shipping_phone}</p>
              <p>Payment Method: <strong className="text-amberBrown-950">{selectedOrder.payment_method}</strong> ({selectedOrder.payment_status})</p>
              {selectedOrder.transaction_id && (
                <p className="font-mono text-[11px] text-amberBrown-800 break-all">
                  TXID / Hash: {selectedOrder.transaction_id}
                </p>
              )}
              {selectedOrder.payment_proof && (
                <div className="pt-2 border-t border-honey-200/80 space-y-1">
                  <span className="font-bold text-amberBrown-900 block text-[11px]">
                    Uploaded Transaction Screenshot:
                  </span>
                  <a
                    href={selectedOrder.payment_proof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block group relative"
                  >
                    <img
                      src={selectedOrder.payment_proof}
                      alt="Payment Receipt"
                      className="w-24 h-24 object-cover rounded-xl border border-honey-300 shadow-2xs group-hover:opacity-90 transition-opacity"
                    />
                    <span className="text-[10px] text-honey-800 font-bold block mt-0.5 group-hover:underline">
                      Click to view full image ↗
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amberBrown-900">
                Products
              </h4>
              <div className="divide-y divide-honey-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.product_image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=100&q=80'}
                        alt={item.product_name}
                        className="w-10 h-10 rounded-lg object-cover bg-honey-50 border border-honey-200"
                      />
                      <div>
                        <p className="font-bold text-amberBrown-950">{item.product_name}</p>
                        <p className="text-amberBrown-500">Qty: {item.quantity} • {item.weight}</p>
                      </div>
                    </div>
                    <span className="font-black text-amberBrown-950">
                      {formatCurrency(item.subtotal || item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-honey-200 space-y-1.5 text-xs text-amberBrown-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{selectedOrder.delivery_fee === 0 ? 'FREE' : formatCurrency(selectedOrder.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-amberBrown-950 pt-1">
                <span>Total</span>
                <span className="text-honey-700">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-honey-200 hover:bg-honey-300 text-amberBrown-900 font-bold text-xs rounded-xl"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
