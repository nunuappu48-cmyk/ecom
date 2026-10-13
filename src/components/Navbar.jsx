import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, ShieldCheck, Heart, LogOut, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { totalItemsCount, setIsCartOpen } = useCart()
  const { user, profile, isAdmin, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="hidden sm:inline">⚡ Fast Worldwide & Domestic Delivery</span>
        <span className="text-blue-400 font-bold">•</span>
        <span>Free express delivery on orders over ₹499 / $49</span>
        <span className="hidden md:inline text-blue-400 font-bold">•</span>
        <span className="hidden md:inline">Use code <span className="text-white font-bold bg-blue-600 px-2 py-0.5 rounded-md text-[11px]">ECOMCENTER10</span> for 10% off</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 p-2 shadow-sm flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.svg" alt="EcomCenter" className="w-full h-full object-contain filter brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                  ECOM<span className="text-blue-600 font-extrabold">CENTER</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold mt-0.5">
                  Modern Shopping Store
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  isActive('/') ? 'text-blue-600 font-bold' : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                Home
                {isActive('/') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </Link>
              <Link
                to="/products"
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  isActive('/products') ? 'text-blue-600 font-bold' : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                All Products
                {isActive('/products') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </Link>
              <Link
                to="/#featured"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Featured Deals
              </Link>
              <Link
                to="/#why-us"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Why Choose Us
              </Link>
              <Link
                to="/#reviews"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Reviews
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                aria-label="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account / Profile */}
              {user ? (
                <div className="relative group">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                      {profile?.full_name || 'My Account'}
                    </span>
                  </Link>

                  {/* Dropdown Menu on hover */}
                  <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      <User className="w-4 h-4" /> My Profile & Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-blue-600 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Shopping Bag Button (Triggers Drawer) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-slate-900 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200 bg-slate-50 py-3 px-4 sm:px-6 shadow-inner animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Slide-down Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
            >
              All Products
            </Link>
            <Link
              to="/#featured"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
            >
              Featured Deals
            </Link>
            <Link
              to="/#why-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
            >
              Why Choose EcomCenter
            </Link>
            <Link
              to="/#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
            >
              Customer Reviews
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-blue-700 bg-blue-50 border border-blue-200"
              >
                🛡️ Admin Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-slate-200">
              {user ? (
                <button
                  onClick={() => {
                    signOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600"
                >
                  Sign Out ({user.email})
                </button>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 bg-slate-100 text-slate-900 rounded-xl font-bold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
