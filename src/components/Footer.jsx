import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck, CreditCard, Lock, RotateCcw } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t-2 border-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 p-2 flex items-center justify-center shadow-xs overflow-hidden">
                <img src="/logo.svg" alt="EcomCenter" className="w-full h-full object-contain filter brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-2xl text-white tracking-tight leading-none">
                  ECOM<span className="text-blue-400 font-extrabold">CENTER</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold mt-0.5">
                  Your Smart Shopping Destination
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover verified products at competitive prices. Fast delivery, secure payments, and hassle-free returns on every single order.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure Checkout
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" /> 30-Day Returns
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400 transition-colors">All Products</Link>
              </li>
              <li>
                <a href="#featured" className="hover:text-blue-400 transition-colors">Featured Deals</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-blue-400 transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-blue-400 transition-colors">Customer Reviews</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/products?category=Kitchen+%26+Dining" className="hover:text-blue-400 transition-colors">Kitchen & Dining</Link>
              </li>
              <li>
                <Link to="/products?category=Home+Decor" className="hover:text-blue-400 transition-colors">Home Decor & Lighting</Link>
              </li>
              <li>
                <Link to="/products?category=Storage+%26+Organization" className="hover:text-blue-400 transition-colors">Storage & Organization</Link>
              </li>
              <li>
                <Link to="/products?category=Bedding+%26+Bath" className="hover:text-blue-400 transition-colors">Bedding & Bath</Link>
              </li>
              <li>
                <Link to="/products?category=Cleaning+%26+Essentials" className="hover:text-blue-400 transition-colors">Cleaning & Laundry</Link>
              </li>
              <li>
                <Link to="/products?category=Smart+Living+%26+Appliances" className="hover:text-blue-400 transition-colors">Smart Living Appliances</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">EcomCenter Global Logistics & Support, 100 Commerce Way</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+18005553266" className="hover:text-blue-400 transition-colors">
                  +1 (800) 555-ECOM
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:support@ecomcenter.com" className="hover:text-blue-400 transition-colors">
                  support@ecomcenter.com
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-2.5 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EcomCenter Co. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Shipping & Returns</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Payment Security</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
