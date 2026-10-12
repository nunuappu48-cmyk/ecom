import React, { useState } from 'react'
import { Mail, Check, Sparkles, Send } from 'lucide-react'
import { newsletterService } from '../services/reviewService'
import { useToast } from '../context/ToastContext'
import { HoneycombPattern } from './HoneyDecoration'

export const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error')
      return
    }

    setLoading(true)
    try {
      await newsletterService.subscribe(email)
      setSubscribed(true)
      setEmail('')
      addToast('🍯 Welcome to the Sweet Loop!', 'success')
    } catch (err) {
      addToast(err.message || 'Subscription failed, please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-cream-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative bg-amber-gold-gradient rounded-[2.5rem] p-6 sm:p-12 shadow-honey-lg text-center overflow-hidden border border-honey-300">
          
          {/* Subtle Honeycomb Pattern Overlay */}
          <HoneycombPattern className="text-amberBrown-900 opacity-10" />

          {/* Floating Bee & Decor */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 text-3xl animate-float-slow">
            🐝
          </div>
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-3xl animate-float-delayed">
            🍯
          </div>

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-amberBrown-900 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-honey-600" />
              <span>Join 5,000+ Honey Lovers</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950 tracking-tight">
              Stay in the Sweet Loop 🍯
            </h2>

            <p className="text-xs sm:text-sm text-amberBrown-900/90 font-medium max-w-md mx-auto leading-relaxed">
              Get product updates, seasonal harvests, special subscriber-only offers, and delicious natural honey recipes.
            </p>

            {subscribed ? (
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-honey-400 text-natureGreen-700 font-bold text-sm flex items-center justify-center gap-2 animate-fadeIn shadow-sm">
                <Check className="w-5 h-5 stroke-[3]" />
                <span>You're in! Check your inbox for your 10% welcome coupon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white text-amberBrown-950 placeholder:text-amberBrown-400 rounded-2xl text-xs sm:text-sm font-medium border border-honey-300 focus:outline-none focus:ring-2 focus:ring-amberBrown-900 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-amberBrown-900 hover:bg-amberBrown-950 text-honey-200 font-black text-xs sm:text-sm rounded-2xl shadow-honey-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75"
                >
                  {loading ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-[11px] text-amberBrown-800/80 font-medium">
              We respect your privacy. No spam, ever. Unsubscribe anytime.
            </p>

          </div>

        </div>
      </div>
    </section>
  )
}
