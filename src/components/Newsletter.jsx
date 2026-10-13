import React, { useState } from 'react'
import { Mail, Check, Sparkles, Send } from 'lucide-react'
import { newsletterService } from '../services/reviewService'
import { useToast } from '../context/ToastContext'

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
      addToast('🎉 Welcome to EcomCenter Insider!', 'success')
    } catch (err) {
      addToast(err.message || 'Subscription failed, please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-12 shadow-xl text-center overflow-hidden">
          
          {/* Subtle Ambient Dots */}
          <div className="absolute inset-0 bg-subtle-grid opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Join 25,000+ Smart Shoppers</span>
            </div>

            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white tracking-tight">
              Unlock 10% Off Your First Order
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 font-normal max-w-md mx-auto leading-relaxed">
              Get secret promotional codes, early access to flash sales, and trending arrival alerts directly in your inbox.
            </p>

            {subscribed ? (
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold text-sm inline-flex items-center gap-2 border border-white/30 animate-fadeIn">
                <Check className="w-5 h-5 text-emerald-300" />
                <span>You're subscribed! Use coupon code <strong>ECOMCENTER10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0 disabled:opacity-75"
                >
                  {loading ? (
                    <span>Joining...</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-[11px] text-blue-200">
              No spam ever. Unsubscribe at any time with one click.
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}
