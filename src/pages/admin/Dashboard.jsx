import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
  Eye
} from 'lucide-react'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatCurrency, formatDate } from '../../utils/formatters'

export const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodList, orderList] = await Promise.all([
          productService.getProducts(),
          orderService.getAllOrdersAdmin()
        ])
        setProducts(prodList)
        setOrders(orderList)
      } catch (err) {
        console.error('Error fetching admin dashboard metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Crunching honey metrics..." />
  }

  // Calculate metrics
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, ord) => sum + Number(ord.total || 0), 0)
  const pendingOrders = orders.filter(ord => ord.status === 'Pending' || ord.status === 'Processing').length
  const lowStockProducts = products.filter(prod => Number(prod.stock || 0) < 50)

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Beekeeper Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-amberBrown-600">
            Overview of store inventory, live honey orders, and revenue.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs rounded-xl shadow-honey-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Honey Product</span>
        </Link>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-honey-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amberBrown-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-natureGreen-100 text-natureGreen-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-amberBrown-950 mt-2">
            {formatCurrency(totalRevenue)}
          </p>
          <span className="text-[10px] text-natureGreen-700 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last month
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-honey-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amberBrown-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-amberBrown-950 mt-2">
            {totalOrders}
          </p>
          <span className="text-[10px] text-amberBrown-500 mt-1 block">
            Across all regions
          </span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-honey-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amberBrown-500 uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-amber-700 mt-2">
            {pendingOrders}
          </p>
          <span className="text-[10px] text-amberBrown-500 mt-1 block">
            Requires fulfillment
          </span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-honey-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amberBrown-500 uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-amberBrown-950 mt-2">
            {totalProducts}
          </p>
          <span className="text-[10px] text-amberBrown-500 mt-1 block">
            In store catalog
          </span>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-honey-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amberBrown-500 uppercase tracking-wider">Low Stock</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif font-black text-xl sm:text-2xl text-red-600 mt-2">
            {lowStockProducts.length}
          </p>
          <span className="text-[10px] text-red-500 font-medium mt-1 block">
            Below 50 units
          </span>
        </div>

      </div>

      {/* Main Row: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-honey-100">
            <h2 className="font-serif font-bold text-lg text-amberBrown-950">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-honey-700 hover:text-amberBrown-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-honey-100">
            {orders.slice(0, 5).map(ord => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div>
                  <p className="font-mono font-bold text-amberBrown-950">{ord.order_number}</p>
                  <p className="text-amberBrown-500 text-[11px]">{ord.shipping_name} • {formatDate(ord.created_at)}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ord.status === 'Delivered'
                      ? 'bg-natureGreen-100 text-natureGreen-800'
                      : ord.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-honey-100 text-honey-800'
                  }`}>
                    {ord.status}
                  </span>
                  <span className="font-serif font-black text-amberBrown-950 text-sm">
                    {formatCurrency(ord.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft space-y-4">
          <h2 className="font-serif font-bold text-lg text-amberBrown-950 pb-3 border-b border-honey-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Inventory Watch</span>
          </h2>

          <div className="space-y-3">
            {lowStockProducts.map(prod => (
              <div key={prod.id} className="flex items-center justify-between p-2.5 bg-cream-50 rounded-xl border border-honey-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-bold text-amberBrown-950 truncate max-w-[120px]">{prod.name}</p>
                    <p className="text-[10px] text-amberBrown-500">{prod.weight}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded text-[10px]">
                  {prod.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
