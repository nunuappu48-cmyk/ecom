import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Store,
  LogOut,
  Coins
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AdminLayout = () => {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Crypto & QR', path: '/admin/crypto', icon: Coins },
  ]

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-amberBrown-900 text-cream-100 flex-shrink-0 border-r border-amberBrown-800 flex flex-col justify-between">
        <div>
          {/* Admin Brand Header */}
          <div className="p-5 border-b border-amberBrown-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-honey-400 shadow-xs overflow-hidden">
                <img src="/logo.png" alt="Fellas Honey" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif font-black text-lg text-honey-400 leading-none block">
                  FELLAS <span className="text-honey-200 text-xs font-sans uppercase tracking-widest">ADMIN</span>
                </span>
                <span className="text-[10px] text-natureGreen-400 font-bold uppercase tracking-wider">
                  Beekeeper Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-honey-500 text-amberBrown-950 shadow-honey-sm'
                      : 'text-cream-200/80 hover:bg-amberBrown-800 hover:text-honey-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-amberBrown-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-honey-300 hover:bg-amberBrown-800 rounded-xl transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  )
}
