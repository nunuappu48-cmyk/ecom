import React from 'react'
import { Sparkles, Leaf, Award, Truck } from 'lucide-react'

export const Features = () => {
  const features = [
    {
      icon: '🍯',
      title: '100% Pure',
      description: 'Naturally sourced and carefully handled with zero additives, preservatives, or artificial sugars.',
      highlight: 'Never Pasteurized'
    },
    {
      icon: '🌿',
      title: 'Naturally Sourced',
      description: 'Collected from trusted wild apiaries and pristine floral reserves away from industrial pollutants.',
      highlight: 'Certified Origins'
    },
    {
      icon: '🐝',
      title: 'Carefully Harvested',
      description: 'Quality-focused, bee-first harvesting process that honors the colony and preserves all live enzymes.',
      highlight: 'Ethical Beekeeping'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Reliable, temperature-protected delivery right to your doorstep with guaranteed freshness.',
      highlight: 'Free Over ₹499'
    }
  ]

  return (
    <section id="why-us" className="py-12 sm:py-20 bg-cream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-200/80 text-amberBrown-900 text-xs font-bold uppercase tracking-wider">
            <span>✨ Pure Gold Standard</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950">
            Why Choose Our Honey
          </h2>
          <p className="text-sm sm:text-base text-amberBrown-700 leading-relaxed">
            We hold ourselves to the highest artisanal standards so you experience raw, unadulterated nature in every single spoonful.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft hover:shadow-honey-md hover:border-honey-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-honey-100 group-hover:bg-amber-gold-gradient flex items-center justify-center text-2xl mb-4 shadow-2xs group-hover:scale-110 transition-all duration-300">
                  <span className="transform group-hover:rotate-12 transition-transform">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-amberBrown-950 mb-2 group-hover:text-honey-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-amberBrown-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-honey-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-natureGreen-700 tracking-wide uppercase">
                  {item.highlight}
                </span>
                <span className="text-honey-500 font-bold text-xs group-hover:translate-x-1 transition-transform">
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
