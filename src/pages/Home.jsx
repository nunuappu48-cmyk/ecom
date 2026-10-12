import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart, Droplets, Compass } from 'lucide-react'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { ProductGrid } from '../components/ProductGrid'
import { ReviewCard } from '../components/ReviewCard'
import { Newsletter } from '../components/Newsletter'
import { HoneycombPattern, BeeIcon } from '../components/HoneyDecoration'
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-honey-600" />
              <span>Small Batch Harvest</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950">
              Featured Honey Reserves
            </h2>
            <p className="text-xs sm:text-sm text-amberBrown-600 mt-1">
              Hand-harvested, raw unheated honeys from our favorite seasonal blossoms.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-honey-700 hover:text-amberBrown-950 transition-colors group"
          >
            <span>View All Varieties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loadingProducts} />
      </section>

      {/* 3. Why Choose Our Honey */}
      <Features />

      {/* 4. Brand Story / About Section */}
      <section id="about" className="py-12 sm:py-20 bg-amber-50/60 relative overflow-hidden border-y border-honey-200/60">
        <HoneycombPattern className="text-honey-400 opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Visual Image Grid */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-honey-lg border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80"
                  alt="Beekeeper harvesting raw honeycomb"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Inset Badge */}
              <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl border border-honey-300 shadow-soft-lg max-w-xs animate-float-slow">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-natureGreen-100 flex items-center justify-center text-natureGreen-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-amberBrown-950">Ethical Apiary</span>
                </div>
                <p className="text-[11px] text-amberBrown-600 leading-snug">
                  Our bees are nourished with their own natural nectar and kept in pristine wild reserves.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-xs font-bold uppercase tracking-wider">
                <BeeIcon className="w-4 h-4" />
                <span>Our Heritage & Passion</span>
              </div>

              <h2 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950 leading-tight">
                From Nature's Flowers <br className="hidden sm:inline" />
                <span className="text-gold-gradient">To Your Breakfast Table</span>
              </h2>

              <p className="text-xs sm:text-sm text-amberBrown-700 leading-relaxed">
                From the flowers of nature to your table, we carefully select and package delicious honey while preserving its natural goodness. We believe that honey should never be ultra-filtered or heated above natural hive temperatures.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-honey-200 text-amberBrown-900 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amberBrown-950">Never Heated, Never Ultra-Filtered</h4>
                    <p className="text-xs text-amberBrown-600">Retains all trace pollen grains, propolis, bioactive enzymes, and delicate botanical terpenes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-honey-200 text-amberBrown-900 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amberBrown-950">Single-Origin Floral Traceability</h4>
                    <p className="text-xs text-amberBrown-600">Every jar comes stamped with the exact floral region, apiary harvest season, and purity batch code.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amberBrown-900 hover:bg-amberBrown-950 text-honey-200 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                >
                  <span>Explore All Honey Types</span>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-xs font-bold uppercase tracking-wider">
            <span>⭐️ Loved by 10,000+ Customers</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950">
            Real Words From Real Honey Lovers
          </h2>
          <p className="text-xs sm:text-sm text-amberBrown-600">
            Read verified reviews from customers who made Fellas Honey their daily ritual.
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
