import React from 'react'
import { Link } from 'react-router-dom'
import { PackageOpen, Plus } from 'lucide-react'
import { ProductCard } from './ProductCard'

export const ProductGrid = ({ products = [], loading = false, emptyMessage = 'No products found' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
          <div key={n} className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 animate-pulse space-y-3">
            <div className="aspect-square bg-slate-100 rounded-xl" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-50 rounded w-full" />
            <div className="h-3 bg-slate-50 rounded w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-slate-100 rounded w-16" />
              <div className="h-8 bg-slate-200 rounded-xl w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-md mx-auto my-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="font-sans font-bold text-lg text-slate-900 mb-1.5">{emptyMessage}</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Your inventory is currently empty. Add your real products from the admin panel or run a database seed.
        </p>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
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
