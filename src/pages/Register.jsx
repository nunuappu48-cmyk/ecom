import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Sparkles, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { HoneycombPattern } from '../components/HoneyDecoration'

export const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone
      })
      if (res?.isFallback) {
        addToast('Account created & logged in! Welcome to Fellas Honey 🍯', 'success')
      } else {
        addToast('Account created successfully! Welcome to Fellas Honey 🍯', 'success')
      }
      navigate('/account')
    } catch (err) {
      addToast(err.message || 'Registration failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 sm:py-16 max-w-md mx-auto px-4 relative">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-honey-300 shadow-soft-lg space-y-6 relative overflow-hidden">
        
        <HoneycombPattern className="text-honey-400 opacity-5" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1.5 mx-auto shadow-honey-sm border border-honey-200 overflow-hidden">
            <img src="/logo.png" alt="Fellas Honey" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Create an Account
          </h1>
          <p className="text-xs text-amberBrown-600">
            Join the Fellas Honey family for special reserve drops and order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-xs sm:text-sm">
          
          <div className="space-y-1.5">
            <label className="block font-bold text-amberBrown-900">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Asim J"
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-amberBrown-900">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-amberBrown-900">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 85898 66422"
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-amberBrown-900">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
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

          <div className="space-y-1.5">
            <label className="block font-bold text-amberBrown-900">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amberBrown-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amberBrown-400 hover:text-amberBrown-700 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
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
            className="w-full py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs sm:text-sm rounded-2xl shadow-honey-md transition-all active:scale-95 disabled:opacity-75"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-amberBrown-600 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-honey-700 hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  )
}
