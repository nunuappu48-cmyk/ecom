import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, ShieldCheck, Heart, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { BeeIcon } from './HoneyDecoration'

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
      <div className="bg-amberBrown-900 text-honey-200 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="hidden sm:inline">🐝 100% Pure, Raw & Unpasteurized</span>
        <span className="text-honey-400 font-bold">•</span>
        <span>Free express delivery across India on orders over ₹499</span>
        <span className="hidden md:inline text-honey-400 font-bold">•</span>
        <span className="hidden md:inline">Use code <span className="text-white font-bold bg-honey-600/60 px-1.5 py-0.5 rounded">HONEY10</span> for 10% off</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-honey-200/60 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-xl text-amberBrown-800 hover:bg-honey-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white p-1.5 border border-honey-200 shadow-honey-sm flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.png" alt="Fellas Honey" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-amberBrown-900 leading-none group-hover:text-honey-700 transition-colors">
                  FELLAS <span className="text-honey-600 font-sans font-extrabold text-sm sm:text-base tracking-widest uppercase ml-0.5">HONEY</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-natureGreen-700 font-semibold mt-0.5">
                  Pure • Organic • Raw
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  isActive('/') ? 'text-honey-700 font-bold' : 'text-amberBrown-800 hover:text-honey-600'
                }`}
              >
                Home
                {isActive('/') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-honey-500 rounded-full" />}
              </Link>
              <Link
                to="/products"
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  isActive('/products') ? 'text-honey-700 font-bold' : 'text-amberBrown-800 hover:text-honey-600'
                }`}
              >
                Shop Honey
                {isActive('/products') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-honey-500 rounded-full" />}
              </Link>
              <Link
                to="/#about"
                className="text-sm font-semibold text-amberBrown-800 hover:text-honey-600 transition-colors"
              >
                Our Story
              </Link>
              <Link
                to="/#why-us"
                className="text-sm font-semibold text-amberBrown-800 hover:text-honey-600 transition-colors"
              >
                Why Choose Us
              </Link>
              <Link
                to="/#reviews"
                className="text-sm font-semibold text-amberBrown-800 hover:text-honey-600 transition-colors"
              >
                Reviews
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl text-amberBrown-800 hover:bg-honey-100 hover:text-honey-700 transition-colors"
                aria-label="Search Honey Products"
              >
                <Search className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>

              {/* User Account / Profile */}
              {user ? (
                <div className="relative group">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-honey-100/70 hover:bg-honey-200/80 border border-honey-200 text-amberBrown-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-honey-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                      {profile?.full_name || 'My Account'}
                    </span>
                  </Link>

                  {/* Dropdown Menu on hover */}
                  <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-soft-lg border border-honey-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-honey-100">
                      <p className="text-xs text-amberBrown-500">Signed in as</p>
                      <p className="text-xs font-bold text-amberBrown-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amberBrown-800 hover:bg-honey-50 hover:text-honey-700"
                    >
                      <User className="w-4 h-4" /> My Profile & Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50"
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
                  className="p-2 sm:px-3 sm:py-2 rounded-xl text-amberBrown-800 hover:bg-honey-100 hover:text-honey-700 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Shopping Bag Button (Triggers Drawer) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-2xl bg-amber-gold-gradient text-amberBrown-900 shadow-honey-sm hover:shadow-honey-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-amberBrown-950 group-hover:rotate-6 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-amberBrown-900 text-honey-300 text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-honey-200 bg-honey-50/95 py-3 px-4 sm:px-6 shadow-inner animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wildflower, acacia, manuka, infused honey..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-honey-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-honey-500 text-amberBrown-900 placeholder:text-amberBrown-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-honey-500 hover:bg-honey-600 text-amberBrown-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 rounded-xl text-amberBrown-600 hover:bg-honey-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Slide-down Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-honey-200 bg-cream-100 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-amberBrown-900 hover:bg-honey-100"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-amberBrown-900 hover:bg-honey-100"
            >
              Shop All Honey
            </Link>
            <Link
              to="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-amberBrown-900 hover:bg-honey-100"
            >
              Our Story & Apiary
            </Link>
            <Link
              to="/#why-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-amberBrown-900 hover:bg-honey-100"
            >
              Why Choose Fellas Honey
            </Link>
            <Link
              to="/#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-amberBrown-900 hover:bg-honey-100"
            >
              Customer Reviews
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-amber-800 bg-amber-50 border border-amber-200"
              >
                🛡️ Admin Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-honey-200">
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
                    className="flex-1 text-center py-2.5 bg-honey-100 text-amberBrown-900 rounded-xl font-bold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 bg-honey-500 text-amberBrown-950 rounded-xl font-bold text-xs"
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
