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
    addToCart(product, 1, product.weight || 'Standard')
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1600)
  }

  const discountPercent = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <div className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Media Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.category && (
            <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-white/95 text-slate-800 backdrop-blur-xs border border-slate-200 shadow-xs">
              {product.category}
            </span>
          )}
          {discountPercent && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Variant / Weight Tag */}
        {product.weight && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
              {product.weight}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {Number(product.rating || 5.0).toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.reviews_count || 36})
            </span>
          </div>

          {/* Name */}
          <Link
            to={`/products/${product.slug}`}
            className="block font-sans font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {formatCurrency(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatCurrency(product.compare_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-xs">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-xs">Add</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
