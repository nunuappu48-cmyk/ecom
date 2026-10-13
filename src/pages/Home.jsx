import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart, Droplets, Compass, ShoppingBag, Check } from 'lucide-react'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { ProductGrid } from '../components/ProductGrid'
import { ReviewCard } from '../components/ReviewCard'
import { Newsletter } from '../components/Newsletter'
import { productService } from '../services/productService'
import { reviewService } from '../services/reviewService'

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)

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

      try {
        const revs = await reviewService.getProductReviews()
        setReviews(revs.slice(0, 4))
      } catch (err) {
        console.error('Error loading reviews:', err)
      } finally {
        setLoadingReviews(false)
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

      {/* 4. Brand Story / About Section */}
      <section id="about" className="py-12 sm:py-20 bg-white relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Visual Image Grid */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=900&q=80"
                  alt="Modern online shopping and quick fulfillment"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Inset Badge */}
              <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xl max-w-xs animate-float-slow">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Verified Quality</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Every product undergoes multi-point inspection before dispatch to ensure 100% satisfaction.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                <span>Our Mission & Standards</span>
              </div>

              <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
                Quality Products, Transparent Value <br className="hidden sm:inline" />
                <span className="text-brand-gradient">Direct To Your Door</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                At EcomCenter, we set out to make online shopping seamless, affordable, and dependable. By partnering directly with verified manufacturers and brands, we cut out middlemen to pass the savings straight on to you.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Guaranteed Authenticity & Freshness</h4>
                    <p className="text-xs text-slate-600">Every item is certified genuine, securely sealed, and protected in temperature-safe packaging.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Swift Nationwide Dispatch</h4>
                    <p className="text-xs text-slate-600">Automated order fulfillment centers ensure same-day processing and rapid doorstep delivery.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                >
                  <span>Explore All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Section */}
      <section id="reviews" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span>⭐️ Loved by 25,000+ Shoppers</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Customer Reviews & Experiences
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Read verified reviews from customers who made EcomCenter their trusted shopping destination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* 6. Newsletter Subscription */}
      <Newsletter />
    </div>
  )
}
