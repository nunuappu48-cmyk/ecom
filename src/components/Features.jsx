import React from 'react'
import { Truck, ShieldCheck, Headphones, Sparkles, ArrowRight } from 'lucide-react'

export const Features = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      title: 'Fast & Free Delivery',
      description: 'Lightning-fast doorstep delivery with real-time live order tracking. Free shipping on all orders over ₹499.',
      highlight: 'Express Dispatch'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: '100% Authentic Quality',
      description: 'Strict quality control on every item. Sourced directly from certified suppliers with complete authenticity guarantee.',
      highlight: 'Verified Products'
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-600" />,
      title: '24/7 Dedicated Support',
      description: 'Friendly customer care team ready around the clock to answer your queries and resolve any order issues.',
      highlight: 'Always Here'
    }
  ]

  return (
    <section id="why-us" className="py-12 sm:py-20 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The EcomCenter Advantage</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Why Shop With EcomCenter
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We deliver the highest standards of reliability, transparent value, and smooth shopping experience on every single order.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">
                  {item.highlight}
                </span>
                <span className="text-blue-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
