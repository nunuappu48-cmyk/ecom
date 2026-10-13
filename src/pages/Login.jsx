import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signIn, loginAsDemo } = useAuth()
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
        email.trim().toLowerCase() === 'admin@fellashoney.com' ||
        email.trim().toLowerCase() === 'admin@ecomcenter.com'

      if (isAdminUser) {
        addToast('Signed in as EcomCenter Administrator! 🚀', 'success')
        navigate('/admin')
      } else {
        addToast('Welcome back to EcomCenter! 🛍️', 'success')
        navigate(redirectPath)
      }
    } catch (err) {
      const msg = err?.message || 'Failed to sign in. Please check your credentials.'
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdminLogin = () => {
    try {
      loginAsDemo('admin')
      addToast('Logged in as Administrator! 🚀', 'success')
      navigate('/admin')
    } catch (err) {
      addToast('Quick login failed', 'error')
    }
  }

  return (
    <div className="py-8 sm:py-16 max-w-md mx-auto px-4 relative">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center p-2.5 mx-auto shadow-md overflow-hidden">
            <img src="/logo.svg" alt="EcomCenter" className="w-full h-full object-contain filter brightness-0 invert" />
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to track orders, manage products, and access your account.
          </p>
        </div>

        {/* 1-Click Admin Quick Login Badge */}
        <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Admin Credentials</p>
              <p className="text-[11px] text-slate-500">admin@ecomcenter.com / admin1235789</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Quick Login</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecomcenter.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin1235789"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 relative z-10">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  )
}
