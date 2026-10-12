import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { HoneycombPattern } from '../components/HoneyDecoration'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = location.state?.from || '/account'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn({ email, password })
      const isAdminUser =
        res?.isDummyAdmin ||
        res?.profile?.role === 'admin' ||
        res?.user?.user_metadata?.role === 'admin' ||
        email.trim().toLowerCase() === 'admin@fellashoney.com'

      if (isAdminUser) {
        addToast('Signed in as Master Beekeeper (Admin)! 🍯', 'success')
        navigate('/admin')
      } else if (res?.unconfirmedFallback) {
        addToast('Signed in successfully! 🍯', 'success')
        navigate(redirectPath)
      } else {
        addToast('Welcome back to Fellas Honey! 🍯', 'success')
        navigate(redirectPath)
      }
    } catch (err) {
      const msg = err?.message || 'Failed to sign in. Please check your credentials.'
      if (msg.toLowerCase().includes('invalid login credentials')) {
        addToast('Invalid email or password. Please verify your credentials and try again.', 'error')
      } else {
        addToast(msg, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 sm:py-16 max-w-md mx-auto px-4 relative">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-honey-300 shadow-soft-lg space-y-6 relative overflow-hidden">
        
        <HoneycombPattern className="text-honey-400 opacity-5" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1.5 mx-auto shadow-honey-sm border border-honey-200 overflow-hidden">
            <img src="/logo.png" alt="Fellas Honey" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Welcome Back
          </h1>
          <p className="text-xs text-amberBrown-600">
            Sign in to track orders, manage your profile and view your honey rewards.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amberBrown-900">
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
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-xs sm:text-sm text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-amberBrown-900">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-honey-700 hover:text-amberBrown-900"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-xs sm:text-sm text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amberBrown-400 hover:text-amberBrown-700 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-amberBrown-700" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs sm:text-sm rounded-2xl shadow-honey-md transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : 'Sign In to Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-amberBrown-600 relative z-10">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-honey-700 hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  )
}
