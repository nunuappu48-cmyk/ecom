import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-amberBrown-900 text-cream-100 pt-12 pb-24 lg:pb-12 border-t-4 border-honey-500 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-amberBrown-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-white p-1.5 flex items-center justify-center border border-honey-400 overflow-hidden shadow-xs">
                <img src="/logo.png" alt="Fellas Honey" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-2xl text-honey-400 tracking-tight leading-none">
                  FELLAS <span className="text-honey-200 font-sans font-extrabold text-sm tracking-widest uppercase">HONEY</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-honey-300 font-semibold mt-0.5">
                  Pure • Organic • Raw
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed max-w-sm">
              From the flowers of nature to your table, we carefully select and package delicious honey while preserving all of its natural enzymes, nutrients, and pure floral essence.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-amberBrown-800/80 text-[10px] font-bold text-honey-300 border border-amberBrown-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-natureGreen-500" /> 100% Raw Unpasteurized
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amberBrown-800/80 text-[10px] font-bold text-honey-300 border border-amberBrown-700 flex items-center gap-1">
                🌿 No Additives
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-honey-400 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link to="/" className="hover:text-honey-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-honey-400 transition-colors">Shop All Honey</Link>
              </li>
              <li>
                <a href="#about" className="hover:text-honey-400 transition-colors">About Our Apiary</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-honey-400 transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-honey-400 transition-colors">Customer Reviews</a>
              </li>
            </ul>
          </div>

          {/* Honey Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-honey-400 uppercase tracking-wider">
              Honey Varieties
            </h4>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link to="/products?category=Wildflower" className="hover:text-honey-400 transition-colors">Alpine Wildflower Honey</Link>
              </li>
              <li>
                <Link to="/products?category=Raw Honey" className="hover:text-honey-400 transition-colors">Raw Organic Mountain Honey</Link>
              </li>
              <li>
                <Link to="/products?category=Rare Reserve" className="hover:text-honey-400 transition-colors">Royal Yemeni Sidr Honey</Link>
              </li>
              <li>
                <Link to="/products?category=Medical Grade" className="hover:text-honey-400 transition-colors">Pure Manuka Honey (MGO 400+)</Link>
              </li>
              <li>
                <Link to="/products?category=Infused Honey" className="hover:text-honey-400 transition-colors">Cinnamon & Ginger Infusions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-honey-400 uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-honey-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Fella Honey, Munderi P.O., Malappuram, Kerala 679334</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-honey-500 flex-shrink-0" />
                <a href="tel:+918589866422" className="hover:text-honey-400 transition-colors">
                  +91 85898 66422
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-honey-500 flex-shrink-0" />
                <a href="mailto:hello@fellashoney.com" className="hover:text-honey-400 transition-colors">
                  hello@fellashoney.com
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-2.5 pt-2">
              <a
                href="https://www.instagram.com/fellas_honey?stkn=MTNvZm82bmFoaHcyZw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-amberBrown-800 flex items-center justify-center text-honey-400 hover:bg-honey-500 hover:text-amberBrown-950 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-amberBrown-800 flex items-center justify-center text-honey-400 hover:bg-honey-500 hover:text-amberBrown-950 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-amberBrown-800 flex items-center justify-center text-honey-400 hover:bg-honey-500 hover:text-amberBrown-950 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-200/60">
          <p>© {new Date().getFullYear()} Fellas Honey Co. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-honey-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-honey-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-honey-400 cursor-pointer">Shipping & Returns</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
