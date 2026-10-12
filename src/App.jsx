import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Components
import { Navbar } from './components/Navbar'
import { MobileNav } from './components/MobileNav'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { AppLoadingScreen } from './components/AppLoadingScreen'

// Store Pages
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetails } from './pages/ProductDetails'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderSuccess } from './pages/OrderSuccess'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Account } from './pages/Account'

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout'
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard'
import { AdminProducts } from './pages/admin/Products'
import { ProductForm } from './pages/admin/ProductForm'
import { AdminOrders } from './pages/admin/Orders'
import { AdminReviews } from './pages/admin/Reviews'
import { AdminCryptoSettings } from './pages/admin/CryptoSettings'

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <AppLoadingScreen text="Verifying Beekeeper Admin access..." />
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Protected Customer Account Guard
const ProtectedAccountRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <AppLoadingScreen text="Loading your honey account..." />
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Main Layout Wrapper for storefront
const StoreLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <CartDrawer />
    <main className="flex-1 pb-16 lg:pb-0">
      {children}
    </main>
    <Footer />
    <MobileNav />
  </div>
)

const AppContent = () => {
  const { loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Keep branded flying bee loading screen visible on app launch, then smoothly dissolve
    const timer = setTimeout(() => {
      setFadeOut(true)
      const removeTimer = setTimeout(() => {
        setShowSplash(false)
      }, 700)
      return () => clearTimeout(removeTimer)
    }, 1300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {(loading || showSplash) && (
        <AppLoadingScreen fadeOut={!loading && fadeOut} />
      )}
      <Router>
        <Routes>
          
          {/* Storefront Routes */}
          <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
          <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
          <Route path="/products/:slug" element={<StoreLayout><ProductDetails /></StoreLayout>} />
          <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
          <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
          <Route path="/order-success/:orderNumber" element={<StoreLayout><OrderSuccess /></StoreLayout>} />
          <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
          <Route path="/register" element={<StoreLayout><Register /></StoreLayout>} />
          <Route path="/forgot-password" element={<StoreLayout><ForgotPassword /></StoreLayout>} />
          <Route
            path="/account"
            element={
              <ProtectedAccountRoute>
                <StoreLayout><Account /></StoreLayout>
              </ProtectedAccountRoute>
            }
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="crypto" element={<AdminCryptoSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
