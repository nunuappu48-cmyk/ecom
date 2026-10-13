import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { ProductGrid } from '../components/ProductGrid'
import { Newsletter } from '../components/Newsletter'
import { productService } from '../services/productService'

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        let prods = await productService.getProducts({ isFeatured: true })
        if (!prods || prods.length === 0) {
          prods = await productService.getProducts()
        }
        setFeaturedProducts(prods.slice(0, 6))
      } catch (err) {
        console.error('Error loading featured products:', err)
      } finally {
        setLoadingProducts(false)
      }
    }

    loadHomeData()
  }, [])

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Products Section */}
      <section id="featured" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Curated Bestsellers</span>
            </div>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Featured Products & Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Handpicked customer favorites, verified quality, and unbeatable everyday value.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loadingProducts} />
      </section>

      {/* 3. Why Choose Us */}
      <Features />

      {/* 4. Newsletter Subscription */}
      <Newsletter />
    </div>
  )
}
