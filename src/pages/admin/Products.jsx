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
  AlertCircle
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
      setProducts(data)
    } catch (err) {
      console.error('Error fetching admin products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
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
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: updated.is_active } : p))
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
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: updated.is_featured } : p))
      addToast(`Featured status updated`, 'success')
    } catch (err) {
      addToast('Failed to update featured status', 'error')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner text="Loading product inventory..." />
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-amberBrown-600">
            Manage your honey varieties, pricing, stock levels, and store visibility.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs rounded-xl shadow-honey-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Honey Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-honey-200 shadow-soft flex items-center gap-2">
        <Search className="w-4 h-4 text-amberBrown-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          className="flex-1 px-2 py-1 bg-transparent text-xs sm:text-sm text-amberBrown-900 placeholder:text-amberBrown-400 focus:outline-none"
        />
        <span className="text-xs font-bold text-amberBrown-500 mr-2">
          {filteredProducts.length} items
        </span>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-honey-200/80 shadow-soft overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-amberBrown-900">
            <thead className="bg-honey-50 text-amberBrown-600 font-bold border-b border-honey-200 uppercase tracking-wider">
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
            <tbody className="divide-y divide-honey-100">
              {filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-cream-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-honey-50 border border-honey-200"
                      />
                      <div>
                        <p className="font-bold text-sm text-amberBrown-950">{prod.name}</p>
                        <p className="text-[11px] text-amberBrown-500">{prod.weight || '500g'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-honey-100 text-amberBrown-800 font-semibold text-[11px]">
                      {prod.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-amberBrown-950">{formatCurrency(prod.price)}</span>
                    {prod.compare_price && (
                      <span className="block text-[10px] text-amberBrown-400 line-through">
                        {formatCurrency(prod.compare_price)}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      prod.stock > 50 ? 'bg-natureGreen-100 text-natureGreen-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prod.stock} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(prod)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        prod.is_featured
                          ? 'bg-honey-100 border-honey-300 text-honey-700'
                          : 'bg-cream-50 border-gray-200 text-gray-400'
                      }`}
                      title="Toggle featured status"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        prod.is_active
                          ? 'bg-natureGreen-100 text-natureGreen-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prod.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{prod.is_active ? 'Active' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${prod.id}/edit`}
                        className="p-1.5 bg-honey-100 hover:bg-honey-200 text-amberBrown-900 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirmId(prod.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete product"
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

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-honey-100 p-3 space-y-3">
          {filteredProducts.map(prod => (
            <div key={prod.id} className="pt-3 first:pt-0 flex flex-col gap-3 bg-cream-50/70 p-3 rounded-2xl border border-honey-200">
              <div className="flex items-center gap-3">
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover bg-honey-50 border border-honey-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amberBrown-500 bg-honey-100 px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                    <span className="font-serif font-black text-amberBrown-950 text-sm">
                      {formatCurrency(prod.price)}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-amberBrown-950 truncate mt-1">{prod.name}</h3>
                  <p className="text-[11px] text-amberBrown-500">Stock: {prod.stock} units ({prod.weight})</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-honey-200/60">
                <button
                  onClick={() => handleToggleActive(prod)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    prod.is_active ? 'bg-natureGreen-100 text-natureGreen-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {prod.is_active ? 'Active' : 'Draft'}
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/${prod.id}/edit`}
                    className="px-3 py-1.5 bg-honey-100 text-amberBrown-900 rounded-lg text-xs font-bold"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirmId(prod.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amberBrown-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-honey-300 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amberBrown-950">
              Delete Honey Product?
            </h3>
            <p className="text-xs text-amberBrown-600">
              Are you sure you want to permanently delete this product from your honey store catalog?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-cream-50 hover:bg-honey-100 text-amberBrown-800 font-bold text-xs rounded-xl border border-honey-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
