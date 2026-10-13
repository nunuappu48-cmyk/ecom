import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  HelpCircle
} from 'lucide-react'
import { productService } from '../../services/productService'
import { HOUSEHOLD_CATEGORIES } from '../../data/householdProducts'
import { useToast } from '../../context/ToastContext'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const CATEGORIES = HOUSEHOLD_CATEGORIES.filter(c => c !== 'All')

export const ProductForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    weight: 'Standard',
    category: CATEGORIES[0] || 'Kitchen & Dining',
    image_url: '',
    stock: 50,
    ingredients: '',
    benefits: '',
    storage_instructions: '',
    is_featured: false,
    is_active: true
  })

  useEffect(() => {
    if (isEdit) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      const prod = await productService.getProductBySlug(id)
      if (prod) {
        setFormData({
          name: prod.name || '',
          slug: prod.slug || '',
          description: prod.description || '',
          price: prod.price || '',
          compare_price: prod.compare_price || '',
          weight: prod.weight || 'Standard',
          category: prod.category || CATEGORIES[0] || 'Kitchen & Dining',
          image_url: prod.image_url || '',
          stock: prod.stock || 50,
          ingredients: prod.ingredients || '',
          benefits: prod.benefits || '',
          storage_instructions: prod.storage_instructions || '',
          is_featured: Boolean(prod.is_featured),
          is_active: prod.is_active !== undefined ? prod.is_active : true
        })
        setImagePreview(prod.image_url || '')
      } else {
        addToast('Product not found', 'error')
        navigate('/admin/products')
      }
    } catch (err) {
      console.error('Error loading product for edit:', err)
      addToast('Failed to load product details', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value }
        // Auto-generate slug from name if adding a new product
        if (!isEdit && name === 'name' && (!prev.slug || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
          updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }
        return updated
      })
    }
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let finalImageUrl = formData.image_url

      // Handle image upload to cloud storage if selected
      if (imageFile) {
        addToast('Uploading product image to storage...', 'info')
        const uploadedUrl = await productService.uploadProductImage(imageFile)
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        }
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        compare_price: formData.compare_price ? Number(formData.compare_price) : null,
        stock: Number(formData.stock),
        image_url: finalImageUrl
      }

      if (isEdit) {
        await productService.updateProduct(id, payload)
        addToast('Product updated successfully!', 'success')
      } else {
        await productService.createProduct(payload)
        addToast('New product added to catalog!', 'success')
      }

      navigate('/admin/products')
    } catch (err) {
      console.error('Save product error:', err)
      const errorMsg = err?.message || ''
      if (errorMsg.includes('duplicate key') || errorMsg.includes('slug')) {
        addToast('A product with this URL slug already exists. Please choose a different name or slug.', 'error')
      } else {
        addToast(errorMsg || 'Failed to save product. Please check form data.', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-xs text-slate-500">
            Configure product metadata, pricing, inventory, and specifications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-sans font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Professional Stainless Steel Knife Set"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">URL Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="professional-stainless-knife-set"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Variant / Unit / Size *</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. Standard, Set of 15, 10-Inch, Queen"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block font-bold text-slate-700">Description *</label>
              <textarea
                rows={3}
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe product features, build materials, dimensions, and everyday utilities..."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <h2 className="font-sans font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
            Pricing & Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Price (₹ / $) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="1499"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Compare Price (₹ / $)</label>
              <input
                type="number"
                step="0.01"
                name="compare_price"
                value={formData.compare_price || ''}
                onChange={handleChange}
                placeholder="1999"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Image Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-sans font-bold text-base text-slate-900">
              Product Photography & Media
            </h2>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              High-Resolution Visuals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4">
              <div className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
              </div>
            </div>

            <div className="sm:col-span-8 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload Product Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Or Direct Image URL (Unsplash / CDN)
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={(e) => {
                    handleChange(e)
                    setImagePreview(e.target.value)
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Materials, Features & Care */}
        <div className="space-y-4">
          <h2 className="font-sans font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
            Materials, Specifications & Care
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Materials & Build Quality</label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="e.g. High-carbon 304 stainless steel, solid oak block, BPA-free"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Key Features & Highlights</label>
              <textarea
                rows={2}
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="e.g. Razor-sharp edge retention, rust-proof, ergonomic handle, induction ready"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Care & Maintenance Instructions</label>
              <input
                type="text"
                name="storage_instructions"
                value={formData.storage_instructions}
                onChange={handleChange}
                placeholder="e.g. Hand wash recommended. Towel dry immediately."
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="accent-blue-600 w-4 h-4 rounded"
            />
            <span>Mark as Featured Product (Home Page Carousel)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="accent-emerald-600 w-4 h-4 rounded"
            />
            <span>Active in Storefront Catalog</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-75"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Product...' : (isEdit ? 'Update Product' : 'Create Product')}</span>
          </button>
        </div>

      </form>

    </div>
  )
}
