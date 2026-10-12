import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Check, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/formatters'

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, product.weight || '500g')
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1600)
  }

  const discountPercent = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-honey-200/80 shadow-soft hover:shadow-honey-md hover:border-honey-400 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Media Container */}
      <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-cream-50 mb-2 sm:mb-3">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.category && (
            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-extrabold bg-white/95 text-amberBrown-900 backdrop-blur-sm border border-honey-200 shadow-2xs">
              {product.category}
            </span>
          )}
          {discountPercent && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-red-600 text-white shadow-2xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Weight Tag */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-amberBrown-950/80 text-honey-200 backdrop-blur-sm">
            {product.weight || '500g'}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-honey-500">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-honey-500 text-honey-500" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-amberBrown-900">
              {Number(product.rating || 5.0).toFixed(1)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amberBrown-400 font-medium">
              ({product.reviews_count || 36})
            </span>
          </div>

          {/* Name */}
          <Link
            to={`/products/${product.slug}`}
            className="block font-serif font-bold text-xs sm:text-base text-amberBrown-950 group-hover:text-honey-700 transition-colors line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="mt-2.5 pt-2 sm:pt-3 border-t border-honey-100 flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-xs sm:text-base font-black text-amberBrown-950 leading-tight">
              {formatCurrency(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-[10px] sm:text-[11px] text-amberBrown-400 line-through">
                {formatCurrency(product.compare_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all duration-200 shadow-sm active:scale-90 ${
              isAdded
                ? 'bg-natureGreen-500 text-white'
                : 'bg-amber-gold-gradient text-amberBrown-950 hover:opacity-90'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span className="text-[11px] sm:text-xs">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[11px] sm:text-xs">Add</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
