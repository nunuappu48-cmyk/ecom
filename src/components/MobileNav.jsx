import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Store, ShoppingBag, User, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export const MobileNav = () => {
  const location = useLocation()
  const { totalItemsCount, setIsCartOpen } = useCart()
  const { user, isAdmin } = useAuth()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home Tab */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
            isActive('/')
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/') ? 'bg-blue-50 text-blue-600' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Home</span>
          {isActive('/') && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -bottom-0.5" />
          )}
        </Link>

        {/* Shop Tab */}
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
            isActive('/products')
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/products') ? 'bg-blue-50 text-blue-600' : ''}`}>
            <Store className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Shop</span>
          {isActive('/products') && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -bottom-0.5" />
          )}
        </Link>

        {/* Quick Cart Button with Bounce Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-2xl relative text-slate-500 hover:text-slate-800 transition-all active:scale-95"
          aria-label="Open Shopping Cart"
        >
          <div className="p-1.5 relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Cart</span>
        </button>

        {/* User / Admin Tab */}
        {isAdmin ? (
          <Link
            to="/admin"
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
              isActive('/admin')
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive('/admin') ? 'bg-blue-50 text-blue-600' : ''}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold tracking-tight">Admin</span>
            {isActive('/admin') && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -bottom-0.5" />
            )}
          </Link>
        ) : (
          <Link
            to={user ? "/account" : "/login"}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
              isActive('/account') || isActive('/login')
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive('/account') || isActive('/login') ? 'bg-blue-50 text-blue-600' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold tracking-tight">{user ? "Account" : "Sign In"}</span>
            {(isActive('/account') || isActive('/login')) && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -bottom-0.5" />
            )}
          </Link>
        )}

      </div>
    </nav>
  )
}
