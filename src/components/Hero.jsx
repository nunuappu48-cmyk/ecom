import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Award } from 'lucide-react'
import { HoneycombPattern, HoneyDropIcon } from './HoneyDecoration'

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-honey-100/90 via-cream-50 to-cream-100 pt-4 pb-10 sm:pt-12 sm:pb-20 border-b border-honey-200/50">

      {/* Background Subtle Honeycomb Pattern */}
      <HoneycombPattern className="text-honey-400 opacity-10" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-honey-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 right-0 w-72 h-72 bg-natureGreen-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">

            {/* Main Headline */}
            <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-amberBrown-950 tracking-tight leading-[1.15]">
              Pure Honey, <br className="hidden sm:inline" />
              <span className="text-gold-gradient relative inline-block">
                Straight From Nature
                {/* Honey Drop SVG Accent */}
                <span className="absolute -top-3 -right-6 hidden sm:inline-block animate-bounce-subtle">
                  <HoneyDropIcon className="w-7 h-7" />
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base lg:text-lg text-amberBrown-700/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Naturally delicious honey, carefully sourced and delivered straight to your doorstep. Unheated, unfiltered, and rich in natural enzymes.
            </p>

            {/* Mobile Quick Category Shortcut Chips */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <Link to="/products?category=Wildflower" className="px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-[10px] font-bold">
                🌸 Wildflower
              </Link>
              <Link to="/products?category=Rare Reserve" className="px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-[10px] font-bold">
                👑 Royal Sidr
              </Link>
              <Link to="/products?category=Medical Grade" className="px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-[10px] font-bold">
                🌿 Manuka
              </Link>
              <Link to="/products?category=Infused Honey" className="px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-[10px] font-bold">
                ✨ Cinnamon
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1">
              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs sm:text-sm rounded-2xl shadow-honey-md hover:shadow-honey-lg transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Shop Honey Reserves</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#featured"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-honey-50 border border-honey-300 text-amberBrown-900 font-bold text-xs sm:text-sm rounded-2xl shadow-2xs hover:shadow-honey-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Explore Products</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-honey-200/60 text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-honey-100 flex items-center justify-center text-honey-700 flex-shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-amberBrown-900 leading-tight">Lab Tested</p>
                  <p className="text-[9px] sm:text-[10px] text-amberBrown-500">100% Pure</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-honey-100 flex items-center justify-center text-honey-700 flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-amberBrown-900 leading-tight">Unfiltered</p>
                  <p className="text-[9px] sm:text-[10px] text-amberBrown-500">Raw Enzymes</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-honey-100 flex items-center justify-center text-honey-700 flex-shrink-0">
                  <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-amberBrown-900 leading-tight">Ethical</p>
                  <p className="text-[9px] sm:text-[10px] text-amberBrown-500">Bee-Friendly</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visuals */}
          <div className="lg:col-span-5 relative mt-2 sm:mt-4 lg:mt-0 flex items-center justify-center">

            {/* Background Hexagon Graphic */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square flex items-center justify-center">

              <div className="absolute inset-0 rounded-full border-2 border-dashed border-honey-400/40 animate-spin-slow duration-30000" />
              <div className="absolute inset-4 rounded-full bg-amber-gold-gradient opacity-15 blur-xl" />

              {/* Main Product Showcase Card */}
              <div className="relative z-10 w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-white shadow-honey-lg bg-gradient-to-tr from-honey-100 to-amber-50 p-1.5 sm:p-2">
                <img
                  src="https://images.unsplash.com/photo-1581271064038-11cf1c43a0b2?auto=format&fit=crop&w=1000&q=85"
                  alt="Pure Natural Honey Jar with Dipper"
                  className="w-full h-full object-cover rounded-[1.75rem] sm:rounded-[2rem] transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge 1: 100% Pure Raw */}
              <div className="absolute -bottom-3 -left-2 sm:bottom-4 sm:-left-4 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-honey-300 shadow-honey-md flex items-center gap-2.5 sm:gap-3 animate-float-slow">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-gold-gradient flex items-center justify-center text-base sm:text-xl shadow-xs">
                  🍯
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black text-amberBrown-950">Raw Wildflower Honey</p>
                  <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-honey-600 font-bold">
                    <span>★ 4.95 Rating</span>
                    <span className="text-amberBrown-300">•</span>
                    <span className="text-natureGreen-700">In Stock</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Organic Certified */}
              <div className="absolute -top-2 -right-2 sm:top-2 sm:-right-4 z-20 bg-amberBrown-900 text-honey-200 p-2 sm:p-3 rounded-2xl shadow-soft-lg flex items-center gap-1.5 sm:gap-2 animate-float-delayed">
                <Sparkles className="w-3.5 h-3.5 text-honey-400" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wide">Pollen Rich & Active</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
