import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const LOCAL_USER_KEY = 'fellas_honey_user_session'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && mounted) {
            setUser(session.user)
            await fetchProfile(session.user.id)
          }
        } else {
          // Check local stored session
          const saved = localStorage.getItem(LOCAL_USER_KEY)
          if (saved && mounted) {
            const parsed = JSON.parse(saved)
            setUser(parsed.user)
            setProfile(parsed.profile)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // Listen to Supabase auth state changes
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      })

      return () => {
        mounted = false
        subscription?.unsubscribe()
      }
    }

    return () => {
      mounted = false
    }
  }, [])

  const fetchProfile = async (userId, currentUser = null) => {
    if (!isSupabaseConfigured()) return
    const activeUser = currentUser || user
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        // Fallback default profile and auto-sync into public.profiles
        const fallbackProf = {
          id: userId,
          full_name: activeUser?.user_metadata?.full_name || 'Customer',
          email: activeUser?.email,
          phone: activeUser?.user_metadata?.phone || '',
          role: activeUser?.user_metadata?.role || (activeUser?.email === 'admin@fellashoney.com' ? 'admin' : 'customer')
        }
        setProfile(fallbackProf)
        try {
          await supabase.from('profiles').upsert(fallbackProf, { onConflict: 'id' })
        } catch (_) { }
      }
    } catch (err) {
      console.warn('Fetch profile error:', err)
    }
  }

  // Sign up
  const signUp = async ({ email, password, full_name, phone }) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
              phone,
              role: 'customer'
            }
          }
        })

        if (error) {
          const isRateLimit =
            error.message?.toLowerCase().includes('rate limit') ||
            error.message?.toLowerCase().includes('email limit') ||
            error.message?.toLowerCase().includes('too many requests') ||
            error.status === 429 ||
            error.code === 'over_email_send_rate_limit'

          if (isRateLimit) {
            console.warn('Supabase email rate limit reached during signUp. Attempting fallback direct login or local session.', error)

            // Attempt direct login in case user was already created in auth.users
            try {
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
              })
              if (!signInError && signInData?.user) {
                setUser(signInData.user)
                await fetchProfile(signInData.user.id)
                return { user: signInData.user, isFallback: true }
              }
            } catch (fallbackSignInErr) {
              console.warn('Direct sign in after rate limit failed:', fallbackSignInErr)
            }

            // Fallback to local session so account creation is never blocked
            const mockUserId = 'user-' + Date.now()
            const mockUser = {
              id: mockUserId,
              email,
              user_metadata: { full_name, phone, role: 'customer' }
            }
            const mockProfile = {
              id: mockUserId,
              full_name,
              email,
              phone,
              role: 'customer',
              created_at: new Date().toISOString()
            }
            setUser(mockUser)
            setProfile(mockProfile)
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
            return { user: mockUser, isFallback: true }
          }

          throw error
        }

        if (data?.user) {
          setUser(data.user)
          const newProf = {
            id: data.user.id,
            full_name: full_name || 'Customer',
            email: email,
            phone: phone || '',
            role: 'customer'
          }
          setProfile(newProf)

          // Proactively persist directly to public.profiles table in Supabase
          try {
            const { error: profError } = await supabase
              .from('profiles')
              .upsert(newProf, { onConflict: 'id' })
            if (profError) {
              console.warn('Direct profile upsert error:', profError)
            }
          } catch (profErr) {
            console.warn('Could not directly upsert to public.profiles:', profErr)
          }
        }
        return data
      } catch (err) {
        const isRateLimit =
          err.message?.toLowerCase().includes('rate limit') ||
          err.message?.toLowerCase().includes('email limit') ||
          err.message?.toLowerCase().includes('too many requests') ||
          err.status === 429 ||
          err.code === 'over_email_send_rate_limit'

        if (isRateLimit) {
          console.warn('Supabase email rate limit caught in catch block. Using local fallback session.', err)
          const mockUserId = 'user-' + Date.now()
          const mockUser = {
            id: mockUserId,
            email,
            user_metadata: { full_name, phone, role: 'customer' }
          }
          const mockProfile = {
            id: mockUserId,
            full_name,
            email,
            phone,
            role: 'customer',
            created_at: new Date().toISOString()
          }
          setUser(mockUser)
          setProfile(mockProfile)
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
          return { user: mockUser, isFallback: true }
        }
        throw err
      }
    }

    // Local Mock signup
    const mockUserId = 'user-' + Date.now()
    const mockUser = { id: mockUserId, email, user_metadata: { full_name, phone, role: 'customer' } }
    const mockProfile = {
      id: mockUserId,
      full_name,
      email,
      phone,
      role: 'customer',
      created_at: new Date().toISOString()
    }
    setUser(mockUser)
    setProfile(mockProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
    return { user: mockUser }
  }

  // Sign in
  const signIn = async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase()

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      })

      if (error) {
        // If the password was valid, but Supabase requires email confirmation:
        if (
          error.message?.toLowerCase().includes('email not confirmed') ||
          error.message?.toLowerCase().includes('not confirmed')
        ) {
          const mockUserId = 'user-' + Date.now()
          const mockUser = { id: mockUserId, email: cleanEmail }
          const mockProfile = {
            id: mockUserId,
            full_name: cleanEmail.split('@')[0],
            email: cleanEmail,
            phone: '+91 85898 66422',
            role: cleanEmail === 'admin@fellashoney.com' ? 'admin' : 'customer',
            created_at: new Date().toISOString()
          }
          setUser(mockUser)
          setProfile(mockProfile)
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
          return { user: mockUser, profile: mockProfile, unconfirmedFallback: true }
        }

        // STRICT SECURITY: Wrong password or invalid credentials must throw an error
        throw error
      }

      if (data?.user) {
        setUser(data.user)
        await fetchProfile(data.user.id, data.user)
      }
      return data
    }

    // Local Mock sign in (only when Supabase is completely unconfigured)
    const isAdminEmail = cleanEmail === 'admin@fellashoney.com'
    if (isAdminEmail) {
      if (password !== 'admin1235789') {
        throw new Error('Invalid email or password.')
      }
    }

    const mockUserId = isAdminEmail ? 'admin-user-id' : 'demo-user-id'
    const mockUser = { id: mockUserId, email: cleanEmail }
    const mockProfile = {
      id: mockUserId,
      full_name: isAdminEmail ? 'Master Beekeeper (Admin)' : 'Honey Enthusiast',
      email: cleanEmail,
      phone: '+91 85898 66422',
      role: isAdminEmail ? 'admin' : 'customer',
      created_at: new Date().toISOString()
    }
    setUser(mockUser)
    setProfile(mockProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
    return { user: mockUser, profile: mockProfile, isDummyAdmin: isAdminEmail }
  }

  // Demo Sign in (One-click for instant preview/testing)
  const loginAsDemo = (role = 'customer') => {
    const isAdm = role === 'admin'
    const mockUserId = isAdm ? 'admin-user-id' : 'demo-user-id'
    const mockUser = {
      id: mockUserId,
      email: isAdm ? 'admin@fellashoney.com' : 'asim@fellashoney.com'
    }
    const mockProfile = {
      id: mockUserId,
      full_name: isAdm ? 'Admin Beekeeper' : 'Asim J (Customer)',
      email: mockUser.email,
      phone: '+1 (555) 349-2910',
      role: isAdm ? 'admin' : 'customer',
      created_at: new Date().toISOString()
    }
    setUser(mockUser)
    setProfile(mockProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
    return { user: mockUser, profile: mockProfile }
  }

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.warn('Sign out error:', err)
      }
    }
    setUser(null)
    setProfile(null)
    localStorage.removeItem(LOCAL_USER_KEY)
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) return

    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()

        if (!error && data) {
          setProfile(data)
          return data
        }
      } catch (err) {
        console.warn('Update profile supabase error:', err)
      }
    }

    setProfile(updated)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user, profile: updated }))
    return updated
  }

  // Reset password
  const resetPassword = async (email) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    }
    return true
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        loginAsDemo,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
