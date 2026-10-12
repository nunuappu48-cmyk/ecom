import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSubmitted(true)
      addToast('Reset instructions sent to your email! 🍯', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to send reset email.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 sm:py-16 max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-honey-300 shadow-soft-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-honey-100 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">
            🔑
          </div>
          <h1 className="font-serif font-black text-2xl text-amberBrown-950">
            Reset Password
          </h1>
          <p className="text-xs text-amberBrown-600">
            Enter the email address associated with your Fellas Honey account.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-natureGreen-50 border border-natureGreen-200 rounded-2xl text-natureGreen-800 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-natureGreen-700 flex-shrink-0" />
              <span>We have sent a password reset link to <strong>{email}</strong>. Please check your inbox.</span>
            </div>
            <Link
              to="/login"
              className="block w-full py-3 text-center bg-honey-500 text-amberBrown-950 font-bold text-xs rounded-xl"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs sm:text-sm rounded-2xl shadow-honey-md transition-all active:scale-95 disabled:opacity-75"
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amberBrown-600 hover:text-honey-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
