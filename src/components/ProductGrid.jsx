import React from 'react'
import { ProductCard } from './ProductCard'

export const ProductGrid = ({ products = [], loading = false, emptyMessage = 'No honey products found' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
          <div key={n} className="bg-white rounded-3xl p-3 sm:p-4 border border-honey-200/50 animate-pulse space-y-3">
            <div className="aspect-square bg-honey-100 rounded-2xl" />
            <div className="h-4 bg-honey-100 rounded w-3/4" />
            <div className="h-3 bg-honey-50 rounded w-full" />
            <div className="h-3 bg-honey-50 rounded w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-honey-100 rounded w-16" />
              <div className="h-8 bg-honey-200 rounded-xl w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-3xl border border-honey-200 max-w-md mx-auto my-8">
        <div className="text-4xl mb-3">🍯</div>
        <h3 className="font-bold text-lg text-amberBrown-900 mb-1">{emptyMessage}</h3>
        <p className="text-xs text-amberBrown-600 mb-4">Try adjusting your filters or search keywords.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {products.map(product => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  )
}
