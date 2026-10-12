import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  X,
  Coins,
  Camera,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react'
import { orderService } from '../../services/orderService'
import { useToast } from '../../context/ToastContext'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatCurrency, formatDate } from '../../utils/formatters'

const ORDER_STATUSES = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [activeOrderModal, setActiveOrderModal] = useState(null)
  const [screenshotModal, setScreenshotModal] = useState(null)
  const [copiedTx, setCopiedTx] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await orderService.getAllOrdersAdmin()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching admin orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePayment = async (order) => {
    try {
      await orderService.updateOrderStatus(order.id, 'Confirmed')
      setOrders(prev =>
        prev.map(o => (o.id === order.id ? { ...o, status: 'Confirmed', payment_status: 'Completed' } : o))
      )
      if (activeOrderModal?.id === order.id) {
        setActiveOrderModal(prev => ({ ...prev, status: 'Confirmed', payment_status: 'Completed' }))
      }
      if (screenshotModal?.id === order.id) {
        setScreenshotModal(prev => ({ ...prev, status: 'Confirmed', payment_status: 'Completed' }))
      }
      addToast(`Payment verified for order ${order.order_number}! Marked as Confirmed. 🍯`, 'success')
    } catch (err) {
      addToast('Failed to update payment status', 'error')
    }
  }

  const handleCopyTx = (txid) => {
    navigator.clipboard.writeText(txid)
    setCopiedTx(true)
    addToast('TXID copied to clipboard!', 'success')
    setTimeout(() => setCopiedTx(false), 2000)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (activeOrderModal?.id === orderId) {
        setActiveOrderModal(prev => ({ ...prev, status: newStatus }))
      }
      addToast(`Order status updated to ${newStatus}`, 'success')
    } catch (err) {
      addToast('Failed to update order status', 'error')
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus
    const matchesSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_email?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return <LoadingSpinner text="Fetching store customer orders..." />
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
          Order Management
        </h1>
        <p className="text-xs sm:text-sm text-amberBrown-600">
          Track customer shipments, process Cash on Delivery receipts, and manage delivery statuses.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-honey-200 shadow-soft">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amberBrown-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, email..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 text-xs sm:text-sm rounded-xl border border-honey-200 focus:outline-none focus:ring-2 focus:ring-honey-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {ORDER_STATUSES.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-amberBrown-900 text-honey-200'
                  : 'bg-cream-50 text-amberBrown-700 hover:bg-honey-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-honey-200/80 shadow-soft overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-amberBrown-900">
            <thead className="bg-honey-50 text-amberBrown-600 font-bold border-b border-honey-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-honey-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-cream-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-amberBrown-950">
                    {order.order_number}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-amberBrown-950">{order.shipping_name}</p>
                    <p className="text-[11px] text-amberBrown-500">{order.shipping_city}, {order.shipping_country}</p>
                  </td>
                  <td className="p-4 text-amberBrown-600">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-amberBrown-800">
                      {order.items?.length || 1} items
                    </span>
                  </td>
                  <td className="p-4 font-serif font-black text-sm text-amberBrown-950">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-honey-100 text-amberBrown-800 block w-fit">
                        {order.payment_method}
                      </span>
                      {order.payment_proof && (
                        <button
                          type="button"
                          onClick={() => setScreenshotModal(order)}
                          className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold flex items-center gap-1 transition-colors border border-amber-300 shadow-2xs"
                          title="View customer payment proof screenshot"
                        >
                          <Camera className="w-3 h-3 text-amber-700" />
                          <span>📸 View Proof</span>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-bold py-1 px-2.5 rounded-full border cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-natureGreen-100 text-natureGreen-800 border-natureGreen-300'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-honey-100 text-honey-800 border-honey-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActiveOrderModal(order)}
                      className="p-1.5 bg-honey-100 hover:bg-honey-200 text-amberBrown-900 rounded-lg text-xs font-bold transition-colors"
                      title="View full order details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-honey-100 p-3 space-y-3">
          {filteredOrders.map(order => (
            <div key={order.id} className="pt-3 first:pt-0 bg-cream-50/70 p-4 rounded-2xl border border-honey-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-amberBrown-950">{order.order_number}</span>
                  <p className="text-[11px] text-amberBrown-500">{formatDate(order.created_at)}</p>
                </div>
                <span className="font-serif font-black text-sm text-honey-800">
                  {formatCurrency(order.total)}
                </span>
              </div>

              <div className="text-xs text-amberBrown-700 space-y-1">
                <p className="font-bold text-amberBrown-950">{order.shipping_name}</p>
                <p className="text-amberBrown-500">{order.shipping_address}, {order.shipping_city}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="px-2 py-0.5 rounded bg-honey-100 text-amberBrown-800 text-[10px] font-semibold">
                    {order.payment_method}
                  </span>
                  {order.payment_proof && (
                    <button
                      type="button"
                      onClick={() => setScreenshotModal(order)}
                      className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[10px] flex items-center gap-1 border border-amber-300"
                    >
                      <Camera className="w-3 h-3 text-amber-700" />
                      <span>📸 View Screenshot</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-honey-200">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="text-xs font-bold py-1 px-2.5 rounded-xl border bg-white text-amberBrown-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => setActiveOrderModal(order)}
                  className="px-3 py-1.5 bg-honey-100 text-amberBrown-900 rounded-lg text-xs font-bold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Order Details Inspection Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amberBrown-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-honey-300 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-honey-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-amberBrown-950">
                  Order Details #{activeOrderModal.order_number}
                </h3>
                <p className="text-xs text-amberBrown-500">{formatDate(activeOrderModal.created_at)}</p>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-1 text-amberBrown-400 hover:text-amberBrown-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-cream-50 p-4 rounded-2xl text-xs space-y-1.5 border border-honey-200">
              <p className="font-bold text-sm text-amberBrown-950">{activeOrderModal.shipping_name}</p>
              <p className="text-amberBrown-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-honey-600" />
                {activeOrderModal.shipping_address}, {activeOrderModal.shipping_city}, {activeOrderModal.shipping_postal_code}
              </p>
              <p className="text-amberBrown-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-honey-600" />
                {activeOrderModal.shipping_phone}
              </p>
              <p className="text-amberBrown-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-honey-600" />
                {activeOrderModal.shipping_email}
              </p>
              <div className="pt-2 border-t border-honey-200 space-y-1">
                <p className="text-amberBrown-900 font-bold flex items-center gap-1.5">
                  Payment: {activeOrderModal.payment_method}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeOrderModal.payment_status === 'Completed'
                      ? 'bg-natureGreen-100 text-natureGreen-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeOrderModal.payment_status}
                  </span>
                </p>
                {activeOrderModal.transaction_id && (
                  <p className="font-mono text-[11px] text-amberBrown-800 break-all">
                    TXID: {activeOrderModal.transaction_id}
                  </p>
                )}
                {activeOrderModal.payment_proof && (
                  <div className="mt-2 p-2.5 bg-white rounded-xl border border-honey-300 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amberBrown-950 text-xs flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        Crypto Transaction Screenshot
                      </span>
                      <button
                        type="button"
                        onClick={() => setScreenshotModal(activeOrderModal)}
                        className="text-[11px] text-honey-800 font-bold hover:underline flex items-center gap-0.5"
                      >
                        Enlarge & Inspect ↗
                      </button>
                    </div>
                    <div
                      onClick={() => setScreenshotModal(activeOrderModal)}
                      className="block overflow-hidden rounded-lg border border-honey-200 cursor-pointer group"
                    >
                      <img
                        src={activeOrderModal.payment_proof}
                        alt="Customer Crypto Transaction Proof"
                        className="w-full max-h-48 object-contain bg-cream-50 group-hover:scale-102 transition-transform"
                      />
                    </div>
                  </div>
                )}
              </div>
              {activeOrderModal.delivery_notes && (
                <p className="pt-1 text-[11px] italic text-amberBrown-600 border-t border-honey-200">
                  Note: "{activeOrderModal.delivery_notes}"
                </p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amberBrown-900">
                Purchased Items ({activeOrderModal.items?.length || 0})
              </h4>
              <div className="divide-y divide-honey-100">
                {activeOrderModal.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product_image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=100&q=80'}
                        alt={item.product_name}
                        className="w-10 h-10 rounded-lg object-cover bg-honey-50 border border-honey-200"
                      />
                      <div>
                        <p className="font-bold text-amberBrown-950">{item.product_name}</p>
                        <p className="text-amberBrown-500">Qty: {item.quantity} × {item.weight || '500g'}</p>
                      </div>
                    </div>
                    <span className="font-black text-amberBrown-950">
                      {formatCurrency(item.subtotal || item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t border-honey-200 space-y-1 text-xs text-amberBrown-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(activeOrderModal.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{activeOrderModal.delivery_fee === 0 ? 'FREE' : formatCurrency(activeOrderModal.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-amberBrown-950 pt-1">
                <span>Grand Total</span>
                <span className="text-honey-700">{formatCurrency(activeOrderModal.total)}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveOrderModal(null)}
              className="w-full py-2.5 bg-honey-500 text-amberBrown-950 font-bold text-xs rounded-xl shadow-honey-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Crypto Screenshot Inspection Modal */}
      {screenshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amberBrown-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-honey-300 shadow-2xl space-y-5 max-h-[95vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-honey-100">
              <div>
                <h3 className="font-serif font-black text-xl text-amberBrown-950 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-honey-700" />
                  <span>Payment Screenshot #{screenshotModal.order_number}</span>
                </h3>
                <p className="text-xs text-amberBrown-500 font-medium">
                  Submitted by {screenshotModal.shipping_name} ({screenshotModal.shipping_email}) • {formatCurrency(screenshotModal.total)}
                </p>
              </div>
              <button
                onClick={() => setScreenshotModal(null)}
                className="p-1 text-amberBrown-400 hover:text-amberBrown-800 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-honey-100 text-amberBrown-900 font-bold rounded-lg border border-honey-200">
                Method: {screenshotModal.payment_method}
              </span>
              <span className={`px-2.5 py-1 font-bold rounded-lg border ${
                screenshotModal.payment_status === 'Completed'
                  ? 'bg-natureGreen-100 text-natureGreen-800 border-natureGreen-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                Payment: {screenshotModal.payment_status}
              </span>
              {screenshotModal.transaction_id && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cream-100 rounded-lg border border-honey-200 font-mono text-[11px] text-amberBrown-900">
                  <span className="font-bold">TXID:</span>
                  <span className="truncate max-w-[160px]">{screenshotModal.transaction_id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyTx(screenshotModal.transaction_id)}
                    className="hover:text-honey-700"
                    title="Copy TXID"
                  >
                    {copiedTx ? <Check className="w-3 h-3 text-natureGreen-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            {/* Main Screenshot Container */}
            <div className="flex-1 overflow-y-auto min-h-[250px] bg-amberBrown-950/5 rounded-2xl p-3 border border-honey-200 flex items-center justify-center">
              <img
                src={screenshotModal.payment_proof}
                alt="Transaction Proof Screenshot"
                className="max-w-full max-h-[55vh] object-contain rounded-xl shadow-soft"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-honey-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={screenshotModal.payment_proof}
                target="_blank"
                rel="noreferrer"
                download={`receipt-${screenshotModal.order_number}.png`}
                className="px-4 py-2.5 bg-cream-100 hover:bg-honey-100 text-amberBrown-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open / Download Original</span>
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setScreenshotModal(null)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-cream-100 hover:bg-honey-100 text-amberBrown-800 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
                {screenshotModal.status !== 'Confirmed' && screenshotModal.status !== 'Delivered' && (
                  <button
                    type="button"
                    onClick={() => handleApprovePayment(screenshotModal)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-natureGreen-600 hover:bg-natureGreen-700 text-white text-xs font-black rounded-xl shadow-honey-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Payment & Confirm Order</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
