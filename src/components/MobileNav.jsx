import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Store, ShoppingBag, User, ShieldCheck, Sparkles } from 'lucide-react'
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-honey-200/80 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(62,39,35,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home Tab */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
            isActive('/')
              ? 'text-amberBrown-950 font-black'
              : 'text-amberBrown-500 hover:text-amberBrown-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/') ? 'bg-honey-100 text-honey-700 shadow-2xs scale-105' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Home</span>
          {isActive('/') && (
            <span className="w-1.5 h-1.5 rounded-full bg-honey-500 absolute -bottom-0.5" />
          )}
        </Link>

        {/* Shop Tab */}
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
            isActive('/products')
              ? 'text-amberBrown-950 font-black'
              : 'text-amberBrown-500 hover:text-amberBrown-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/products') ? 'bg-honey-100 text-honey-700 shadow-2xs scale-105' : ''}`}>
            <Store className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Shop</span>
          {isActive('/products') && (
            <span className="w-1.5 h-1.5 rounded-full bg-honey-500 absolute -bottom-0.5" />
          )}
        </Link>

        {/* Quick Cart Button with Bounce Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-2xl relative text-amberBrown-500 hover:text-amberBrown-800 transition-all active:scale-95"
          aria-label="Open Shopping Cart"
        >
          <div className="relative p-1.5 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-amberBrown-700" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-amberBrown-900 text-honey-300 text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight text-amberBrown-700">Cart</span>
        </button>

        {/* Account / Admin Tab */}
        <Link
          to={user ? (isAdmin ? "/admin" : "/account") : "/login"}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all relative ${
            isActive('/account') || isActive('/admin') || isActive('/login')
              ? 'text-amberBrown-950 font-black'
              : 'text-amberBrown-500 hover:text-amberBrown-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            isActive('/account') || isActive('/admin') || isActive('/login')
              ? (isAdmin ? 'bg-amber-100 text-amber-800 shadow-2xs scale-105' : 'bg-honey-100 text-honey-700 shadow-2xs scale-105')
              : ''
          }`}>
            {isAdmin ? (
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight truncate max-w-[54px]">
            {isAdmin ? 'Admin' : (user ? 'Account' : 'Sign In')}
          </span>
          {(isActive('/account') || isActive('/admin') || isActive('/login')) && (
            <span className="w-1.5 h-1.5 rounded-full bg-honey-500 absolute -bottom-0.5" />
          )}
        </Link>

      </div>
    </nav>
  )
}
