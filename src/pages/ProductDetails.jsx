import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Check,
  Leaf,
  Info,
  Heart,
  MessageSquare,
  Share2,
  ChevronRight
} from 'lucide-react'
import { productService } from '../services/productService'
import { reviewService } from '../services/reviewService'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ProductCard } from '../components/ProductCard'
import { ReviewCard } from '../components/ReviewCard'
import { formatCurrency, formatDate } from '../utils/formatters'

const WEIGHT_MULTIPLIERS = {
  '250g': 0.6,
  '500g': 1.0,
  '1kg': 1.8
}

export const ProductDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const { user, profile } = useAuth()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Selection states
  const [selectedWeight, setSelectedWeight] = useState('500g')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('benefits')
  const [isAdded, setIsAdded] = useState(false)

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        const prod = await productService.getProductBySlug(slug)
        if (!prod) {
          navigate('/products')
          return
        }
        setProduct(prod)
        setSelectedWeight(prod.weight || '500g')

        // Fetch related products
        const allProds = await productService.getProducts()
        setRelatedProducts(allProds.filter(p => p.slug !== slug).slice(0, 4))

        // Fetch reviews
        const revs = await reviewService.getProductReviews(prod.id)
        setReviews(revs)
      } catch (err) {
        console.error('Error fetching product details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug, navigate])

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Harvesting pure honey details..." />
      </div>
    )
  }

  // Calculate dynamic price based on weight
  const basePrice = Number(product.price)
  const weightMultiplier = WEIGHT_MULTIPLIERS[selectedWeight] || 1.0
  const currentPrice = Math.round(basePrice * weightMultiplier)
  const currentComparePrice = product.compare_price
    ? Math.round(Number(product.compare_price) * weightMultiplier)
    : null

  const handleAddToCart = () => {
    const itemToAdd = { ...product, price: currentPrice }
    addToCart(itemToAdd, quantity, selectedWeight)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    const itemToAdd = { ...product, price: currentPrice }
    addToCart(itemToAdd, quantity, selectedWeight)
    navigate('/checkout')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      addToast('Product link copied to clipboard! 🍯', 'success')
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewComment.trim()) {
      addToast('Please write your review comment', 'error')
      return
    }

    setSubmittingReview(true)
    try {
      const newRev = await reviewService.addReview({
        product_id: product.id,
        user_name: profile?.full_name || 'Honey Lover',
        rating: reviewRating,
        comment: reviewComment.trim()
      })

      setReviews(prev => [newRev, ...prev])
      setShowReviewModal(false)
      setReviewComment('')
      addToast('✨ Thank you for your review!', 'success')
    } catch (err) {
      addToast('Failed to post review, please try again.', 'error')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="py-4 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 pb-28 lg:pb-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-amberBrown-500">
        <Link to="/" className="hover:text-amberBrown-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-amberBrown-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amberBrown-900 truncate max-w-[160px] sm:max-w-[240px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14">
        
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-honey-200/80 shadow-soft-lg group">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.is_featured && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 bg-amberBrown-900 text-honey-200 text-[11px] sm:text-xs font-black rounded-full shadow-md">
                👑 Reserve Batch
              </span>
            )}
            
            {/* Share button */}
            <button
              onClick={handleShare}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-amberBrown-800 shadow-sm hover:bg-honey-100 transition-colors"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3 py-1 bg-white/95 backdrop-blur-md border border-honey-200 text-natureGreen-800 text-[11px] sm:text-xs font-bold rounded-full shadow-xs">
              🌿 100% Raw & Unpasteurized
            </span>
          </div>
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          
          {/* Category, Stock & Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-honey-100 text-amberBrown-900 text-xs font-extrabold uppercase tracking-wider">
                {product.category || 'Pure Honey'}
              </span>
              <span className="text-xs font-bold text-natureGreen-700 bg-natureGreen-50 px-2.5 py-1 rounded-lg border border-natureGreen-200">
                In Stock ({product.stock} units)
              </span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950 leading-tight">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-honey-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-honey-500 text-honey-500" />
                ))}
              </div>
              <span className="text-sm font-black text-amberBrown-900">
                {Number(product.rating || 5.0).toFixed(2)}
              </span>
              <span className="text-xs text-amberBrown-500 font-medium">
                ({reviews.length || product.reviews_count || 42} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-cream-50 rounded-2xl border border-honey-200/90 flex items-baseline gap-3 shadow-2xs">
            <span className="font-serif font-black text-3xl sm:text-4xl text-amberBrown-950">
              {formatCurrency(currentPrice)}
            </span>
            {currentComparePrice && (
              <span className="text-sm sm:text-base text-amberBrown-400 line-through">
                {formatCurrency(currentComparePrice)}
              </span>
            )}
            <span className="text-[11px] font-bold text-natureGreen-700 ml-auto bg-natureGreen-100/80 px-2.5 py-1 rounded-md">
              Free Shipping eligible
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-amberBrown-700 leading-relaxed">
            {product.description}
          </p>

          {/* Weight Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amberBrown-900">
              Select Jar Weight
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {['250g', '500g', '1kg'].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWeight(w)}
                  className={`py-2.5 px-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                    selectedWeight === w
                      ? 'bg-amber-gold-gradient border-honey-500 text-amberBrown-950 shadow-honey-sm font-black'
                      : 'bg-white border-honey-200 text-amberBrown-800 hover:bg-honey-50'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Desktop Buttons */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-honey-300 rounded-2xl bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-xl hover:bg-honey-100 text-amberBrown-800 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3.5 text-sm font-black text-amberBrown-950 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-xl hover:bg-honey-100 text-amberBrown-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-honey-md active:scale-95 ${
                  isAdded
                    ? 'bg-natureGreen-500 text-white'
                    : 'bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatCurrency(currentPrice * quantity)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-2xl bg-amberBrown-900 hover:bg-amberBrown-950 text-honey-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4 text-honey-400 fill-honey-400" />
              <span>Instant Checkout / Buy Now</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-honey-200 text-center">
            <div className="p-2 bg-cream-50 rounded-xl border border-honey-200">
              <Truck className="w-4 h-4 mx-auto text-honey-600 mb-1" />
              <p className="text-[10px] font-bold text-amberBrown-900">Fast Delivery</p>
              <p className="text-[9px] text-amberBrown-500">2-4 Days</p>
            </div>
            <div className="p-2 bg-cream-50 rounded-xl border border-honey-200">
              <ShieldCheck className="w-4 h-4 mx-auto text-honey-600 mb-1" />
              <p className="text-[10px] font-bold text-amberBrown-900">100% Authentic</p>
              <p className="text-[9px] text-amberBrown-500">Raw Tested</p>
            </div>
            <div className="p-2 bg-cream-50 rounded-xl border border-honey-200">
              <RotateCcw className="w-4 h-4 mx-auto text-honey-600 mb-1" />
              <p className="text-[10px] font-bold text-amberBrown-900">Safe Return</p>
              <p className="text-[9px] text-amberBrown-500">Guaranteed</p>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs / Accordions: Ingredients, Benefits, Product Info, Storage */}
      <div className="bg-white rounded-3xl border border-honey-200/80 p-5 sm:p-8 shadow-soft">
        <div className="flex border-b border-honey-200 gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'benefits', label: 'Health Benefits' },
            { id: 'ingredients', label: 'Pure Ingredients' },
            { id: 'storage', label: 'Storage & Usage' },
            { id: 'origin', label: 'Harvest Origin' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 font-bold text-xs sm:text-sm whitespace-nowrap rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-honey-100 text-amberBrown-950 font-extrabold shadow-2xs'
                  : 'text-amberBrown-600 hover:text-amberBrown-900 hover:bg-honey-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-5 text-xs sm:text-sm text-amberBrown-700 leading-relaxed">
          {activeTab === 'benefits' && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-amberBrown-950">
                Natural Bioactive Wellness
              </h3>
              <p>{product.benefits || 'Packed with live bioactive enzymes, pure propolis, and antioxidants that support immune health and natural energy.'}</p>
              <ul className="list-disc list-inside space-y-1 text-amberBrown-600">
                <li>Natural energy source with sustained glycemic absorption</li>
                <li>Rich in polyphenols that fight free radicals and cellular stress</li>
                <li>Soothes sore throats and maintains natural gut microbiome harmony</li>
              </ul>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-amberBrown-950">
                Single-Ingredient Purity
              </h3>
              <p className="font-medium text-amberBrown-900 bg-honey-50 p-4 rounded-2xl border border-honey-200">
                {product.ingredients || '100% Pure Raw Honey. No additives, no sugar syrup, no artificial flavors.'}
              </p>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-amberBrown-950">
                Storage & Crystallization
              </h3>
              <p>{product.storage_instructions || 'Store in a cool, dry place away from direct sunlight. Do not refrigerate.'}</p>
              <p className="text-xs text-amberBrown-500 italic">
                Note: Natural crystallization is the hallmark of truly raw honey. To re-liquefy, gently place the jar in a warm water bath below 40°C.
              </p>
            </div>
          )}

          {activeTab === 'origin' && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-amberBrown-950">
                Ethical Beekeeper Harvest
              </h3>
              <p>
                Harvested from certified wild apiaries situated in secluded alpine reserves and protected valleys. Zero exposure to synthetic pesticides or industrial agricultural runoff.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews & Add Review Form */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-black text-xl sm:text-3xl text-amberBrown-950">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-amberBrown-600 mt-0.5">
              Verified feedback from honey lovers who tasted this batch.
            </p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2.5 bg-honey-500 hover:bg-honey-600 text-amberBrown-950 font-bold text-xs rounded-xl shadow-honey-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="p-6 bg-white rounded-3xl border border-honey-200 text-center text-xs text-amberBrown-600">
            Be the first to leave a review for {product.name}! 🍯
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {reviews.map(rev => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amberBrown-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-honey-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-amberBrown-950">
                Review {product.name}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 text-amberBrown-400 hover:text-amberBrown-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amberBrown-900 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'fill-honey-500 text-honey-500'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amberBrown-900 mb-1">
                  Your Experience & Flavor Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how it tastes, texture, aroma, or how you enjoy it..."
                  className="w-full p-3 bg-cream-50 border border-honey-300 rounded-xl text-xs sm:text-sm text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-amberBrown-600 hover:text-amberBrown-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-honey-500 hover:bg-honey-600 text-amberBrown-950 font-bold text-xs rounded-xl shadow-honey-sm"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* "You May Also Like" Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-honey-200">
          <div>
            <h2 className="font-serif font-black text-lg sm:text-2xl text-amberBrown-950">
              You May Also Like
            </h2>
            <p className="text-xs text-amberBrown-600 mt-0.5">
              Complementary raw honeys and artisanal infusions.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id || rel.slug} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* 📱 Dedicated Mobile Sticky Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-[60px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-honey-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-amberBrown-500 block leading-tight font-medium">Total ({selectedWeight})</span>
          <span className="font-serif font-black text-lg text-amberBrown-950 leading-none">
            {formatCurrency(currentPrice * quantity)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 ${
              isAdded ? 'bg-natureGreen-500 text-white' : 'bg-honey-100 text-amberBrown-950 border border-honey-300'
            }`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{isAdded ? 'Added' : 'Cart'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-gold-gradient text-amberBrown-950 font-black text-xs flex items-center justify-center gap-1 shadow-honey-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

    </div>
  )
}
