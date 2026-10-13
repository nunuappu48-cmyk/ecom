import React, { createContext, useContext, useState, useEffect } from 'react'
import { neonSql } from '../lib/neon'

const AuthContext = createContext(null)

const LOCAL_USER_KEY = 'ecomcenter_user_session'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session from local storage and sync with Neon
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const saved = localStorage.getItem(LOCAL_USER_KEY) || localStorage.getItem('fellas_honey_user_session')
        if (saved && mounted) {
          const parsed = JSON.parse(saved)
          setUser(parsed.user)
          setProfile(parsed.profile)

          // Background sync with Neon profiles
          if (neonSql && (parsed.profile?.email || parsed.user?.email)) {
            const email = (parsed.profile?.email || parsed.user?.email).toLowerCase()
            try {
              const rows = await neonSql`SELECT * FROM public.profiles WHERE LOWER(email) = ${email} LIMIT 1`
              if (rows && rows.length > 0 && mounted) {
                setProfile(rows[0])
                localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: parsed.user, profile: rows[0] }))
              }
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  // Sign up
  const signUp = async ({ email, password, full_name, phone }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const isAdmin = cleanEmail === 'admin@ecomcenter.com' || cleanEmail === 'admin@fellashoney.com'
    const role = isAdmin ? 'admin' : 'customer'
    const userId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `u-${Date.now()}`

    const newProfile = {
      id: userId,
      full_name: full_name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: phone || '',
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const newUser = {
      id: userId,
      email: cleanEmail,
      user_metadata: { full_name: newProfile.full_name, phone: newProfile.phone, role }
    }

    // Save into Neon database
    if (neonSql) {
      try {
        await neonSql`
          INSERT INTO public.profiles (full_name, email, phone, role)
          VALUES (${newProfile.full_name}, ${cleanEmail}, ${newProfile.phone}, ${role})
          ON CONFLICT (email) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            updated_at = now()
        `
      } catch (neonErr) {
        console.warn('Neon profile insert warning:', neonErr.message)
      }
    }

    setUser(newUser)
    setProfile(newProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: newUser, profile: newProfile }))
    return { user: newUser, profile: newProfile }
  }

  // Sign in
  const signIn = async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const isAdminEmail = cleanEmail === 'admin@ecomcenter.com' || cleanEmail === 'admin@fellashoney.com'

    if (isAdminEmail) {
      if (password !== 'admin1235789') {
        throw new Error('Invalid email or password.')
      }
    }

    let loadedProfile = null

    // Check Neon database for user profile
    if (neonSql) {
      try {
        const rows = await neonSql`SELECT * FROM public.profiles WHERE LOWER(email) = ${cleanEmail} LIMIT 1`
        if (rows && rows.length > 0) {
          loadedProfile = rows[0]
        }
      } catch (err) {
        console.warn('Neon signIn fetch profile error:', err.message)
      }
    }

    const userId = loadedProfile?.id || (isAdminEmail ? 'admin-user-id' : `user-${Date.now()}`)
    const role = loadedProfile?.role || (isAdminEmail ? 'admin' : 'customer')

    const loggedProfile = loadedProfile || {
      id: userId,
      full_name: isAdminEmail ? 'EcomCenter Admin' : cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '+1 (555) 349-2910',
      role,
      created_at: new Date().toISOString()
    }

    const loggedUser = {
      id: userId,
      email: cleanEmail,
      user_metadata: { full_name: loggedProfile.full_name, role }
    }

    setUser(loggedUser)
    setProfile(loggedProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: loggedUser, profile: loggedProfile }))
    return { user: loggedUser, profile: loggedProfile }
  }

  // One-click demo sign in
  const loginAsDemo = (role = 'customer') => {
    const isAdm = role === 'admin'
    const mockUserId = isAdm ? 'admin-user-id' : 'demo-user-id'
    const email = isAdm ? 'admin@ecomcenter.com' : 'customer@ecomcenter.com'

    const mockProfile = {
      id: mockUserId,
      full_name: isAdm ? 'EcomCenter Admin' : 'Demo Customer',
      email,
      phone: '+1 (555) 349-2910',
      role: isAdm ? 'admin' : 'customer',
      created_at: new Date().toISOString()
    }

    const mockUser = {
      id: mockUserId,
      email,
      user_metadata: { full_name: mockProfile.full_name, role: mockProfile.role }
    }

    setUser(mockUser)
    setProfile(mockProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }))
    return { user: mockUser, profile: mockProfile }
  }

  // Sign out
  const signOut = async () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem(LOCAL_USER_KEY)
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!user && !profile) return

    const updated = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString()
    }

    if (neonSql && (profile?.email || user?.email)) {
      const email = (profile?.email || user?.email).toLowerCase()
      try {
        await neonSql`
          UPDATE public.profiles
          SET full_name = ${updated.full_name},
              phone = ${updated.phone || ''},
              updated_at = now()
          WHERE LOWER(email) = ${email} OR id::text = ${updated.id}
        `
      } catch (err) {
        console.warn('Neon updateProfile warning:', err.message)
      }
    }

    setProfile(updated)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user, profile: updated }))
    return updated
  }

  // Reset password
  const resetPassword = async (email) => {
    // Standard mock password reset response
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
