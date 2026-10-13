import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  Package,
  PackageOpen
} from 'lucide-react'
import { productService } from '../../services/productService'
import { useToast } from '../../context/ToastContext'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatCurrency } from '../../utils/formatters'

export const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getProducts()
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching admin products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id && p.slug !== id))
      setDeleteConfirmId(null)
      addToast('Product removed from catalog', 'info')
    } catch (err) {
      addToast('Failed to delete product', 'error')
    }
  }

  const handleToggleActive = async (product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_active: !product.is_active
      })
      setProducts(prev => prev.map(p => (p.id === product.id || p.slug === product.slug) ? { ...p, is_active: updated.is_active } : p))
      addToast(`Product marked as ${updated.is_active ? 'Active' : 'Inactive'}`, 'success')
    } catch (err) {
      addToast('Failed to update product status', 'error')
    }
  }

  const handleToggleFeatured = async (product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_featured: !product.is_featured
      })
      setProducts(prev => prev.map(p => (p.id === product.id || p.slug === product.slug) ? { ...p, is_featured: updated.is_featured } : p))
      addToast(`Featured status updated`, 'success')
    } catch (err) {
      addToast('Failed to update featured status', 'error')
    }
  }

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner text="Loading product inventory..." />
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your store catalog, pricing, stock levels, and storefront visibility.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          className="flex-1 px-2 py-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <span className="text-xs font-bold text-slate-500 mr-2">
          {filteredProducts.length} items
        </span>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {filteredProducts.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <PackageOpen className="w-7 h-7" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900 mb-1">No products in catalog</h3>
            <p className="text-xs text-slate-500 mb-4">Click below to add your first product.</p>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id || prod.slug} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {prod.image_url ? (
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</p>
                            <p className="text-slate-500 text-[11px] font-mono mt-0.5">{prod.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {formatCurrency(prod.price)}
                        </div>
                        {prod.compare_price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(prod.compare_price)}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${
                          Number(prod.stock) < 10 ? 'text-rose-600' : 'text-slate-700'
                        }`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFeatured(prod)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            prod.is_featured
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={prod.is_featured ? "Featured on Home" : "Not Featured"}
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(prod)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            prod.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prod.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/products/${prod.id || prod.slug}/edit`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(prod.id || prod.slug)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
              {filteredProducts.map(prod => (
                <div key={prod.id || prod.slug} className="pt-3 first:pt-0 flex flex-col gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {prod.category}
                      </span>
                      <p className="font-bold text-slate-900 text-sm mt-1 truncate">{prod.name}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-black text-slate-900">{formatCurrency(prod.price)}</span>
                        <span className="text-[11px] text-slate-500">Stock: {prod.stock}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          prod.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {prod.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/${prod.id || prod.slug}/edit`}
                        className="px-3 py-1.5 bg-slate-200 text-slate-900 rounded-lg text-xs font-bold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirmId(prod.id || prod.slug)}
                        className="p-1.5 bg-rose-100 text-rose-700 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-slate-900">Delete Product?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this item from the store catalog?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
