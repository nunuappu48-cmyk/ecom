import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award, ShoppingBag, Zap } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-6 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-200">

      {/* Subtle modern mesh pattern */}
      <div className="absolute inset-0 bg-subtle-grid opacity-25 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">

            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>Mega Seasonal Sale • Up to 40% OFF</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.12]">
              Elevate Your Living, <br className="hidden sm:inline" />
              <span className="text-brand-gradient">Delivered to Your Door</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover premium kitchenware, smart home appliances, organization essentials, and timeless decor. Guaranteed durability, fast shipping, and easy 30-day returns.
            </p>

            {/* Mobile Quick Category Shortcut Chips */}
            <div className="flex sm:hidden items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Link to="/products?category=Kitchen+%26+Dining" className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs">
                🍳 Kitchen
              </Link>
              <Link to="/products?category=Home+Decor" className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs">
                🌿 Decor
              </Link>
              <Link to="/products?category=Storage+%26+Organization" className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-2xs">
                📦 Storage
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#featured"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>View Trending Deals</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 sm:pt-6 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-200 text-left">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Fast Shipping</p>
                  <p className="text-[10px] text-slate-500">Free over ₹499</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">100% Genuine</p>
                  <p className="text-[10px] text-slate-500">Verified Quality</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">30-Day Return</p>
                  <p className="text-[10px] text-slate-500">Money Guarantee</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visuals */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex items-center justify-center">

            <div className="relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center">

              {/* Decorative Circular Background Ring */}
              <div className="absolute inset-0 rounded-full border border-blue-200/60" />
              <div className="absolute inset-4 rounded-full bg-blue-100/40 blur-xl" />

              {/* Main Product Showcase Card */}
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85"
                  alt="Modern Household Essentials Showcase"
                  className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge 1: Rating & Stock */}
              <div className="absolute -bottom-3 -left-2 sm:bottom-4 sm:-left-4 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-3 animate-float-slow">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-base shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Top Rated Seller</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                    <span className="text-amber-500 font-bold">★ 4.95 Rating</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600 font-bold">In Stock</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Verified Guarantee */}
              <div className="absolute -top-2 -right-2 sm:top-2 sm:-right-4 z-20 bg-slate-900 text-white p-2.5 sm:p-3 rounded-2xl shadow-lg flex items-center gap-2 animate-float-delayed">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold tracking-wide">EcomCenter Guaranteed</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
