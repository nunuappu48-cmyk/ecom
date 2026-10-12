import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Image as ImageIcon, Sparkles } from 'lucide-react'
import { productService } from '../../services/productService'
import { useToast } from '../../context/ToastContext'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { generateSlug } from '../../utils/formatters'

const CATEGORIES = [
  'Wildflower',
  'Raw Honey',
  'Monofloral',
  'Rare Reserve',
  'Medical Grade',
  'Infused Honey',
  'Honeydew'
]

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
    weight: '500g',
    category: 'Wildflower',
    image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    ingredients: '100% Pure Raw Honey.',
    benefits: 'Rich in antioxidants, live digestive enzymes, and natural botanical terpenes.',
    storage_instructions: 'Store at room temperature away from direct sunlight. Do not refrigerate.',
    is_featured: false,
    is_active: true
  })

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        try {
          const prods = await productService.getProducts()
          const found = prods.find(p => p.id === id)
          if (found) {
            setFormData(found)
            setImagePreview(found.image_url)
          } else {
            navigate('/admin/products')
          }
        } catch (err) {
          console.error('Error fetching product for edit:', err)
        } finally {
          setLoading(false)
        }
      }
      loadProduct()
    }
  }, [id, isEdit, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'name' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generateSlug(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let finalImageUrl = formData.image_url

      // Handle image upload to Supabase storage if selected
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
        addToast('Product updated successfully! 🍯', 'success')
      } else {
        await productService.createProduct(payload)
        addToast('New product added to catalog! 🍯', 'success')
      }

      navigate('/admin/products')
    } catch (err) {
      console.error('Save product error:', err)
      const errorMsg = err?.message || ''
      if (errorMsg.includes('row-level security') || errorMsg.includes('42501')) {
        addToast('Database RLS Policy Error: Please run the RLS fix script in Supabase SQL editor to allow product updates.', 'error')
      } else if (errorMsg.includes('duplicate key') || errorMsg.includes('slug')) {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl bg-white border border-honey-200 text-amberBrown-800 hover:bg-honey-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            {isEdit ? 'Edit Honey Product' : 'Add New Honey Variety'}
          </h1>
          <p className="text-xs text-amberBrown-600">
            Configure product metadata, pricing, batch weights, and storage guidelines.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-honey-200/80 shadow-soft space-y-6 text-xs sm:text-sm">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-base text-amberBrown-950 pb-2 border-b border-honey-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Sidr Honey"
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">URL Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="royal-sidr-honey"
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Default Weight *</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="500g"
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Description *</label>
              <textarea
                rows={3}
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe floral origin, tasting notes, texture..."
                className="w-full p-3 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-base text-amberBrown-950 pb-2 border-b border-honey-100">
            Pricing & Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Price (₹) *</label>
              <input
                type="number"
                step="1"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Compare Price (₹)</label>
              <input
                type="number"
                step="1"
                name="compare_price"
                value={formData.compare_price || ''}
                onChange={handleChange}
                placeholder="599"
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Image Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-honey-100">
            <h2 className="font-serif font-bold text-base text-amberBrown-950">
              Product Media & Photography
            </h2>
            <span className="text-[10px] font-bold text-honey-800 bg-honey-100 px-2 py-0.5 rounded">
              🔥 Firebase Storage Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4">
              <div className="aspect-square rounded-2xl bg-cream-50 border-2 border-dashed border-honey-300 overflow-hidden flex items-center justify-center relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-amberBrown-300" />
                )}
              </div>
            </div>

            <div className="sm:col-span-8 space-y-3">
              <div>
                <label className="block font-bold text-amberBrown-900 mb-1">
                  Upload Jar Photo (Firebase Cloud Storage)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-amberBrown-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-honey-100 file:text-amberBrown-950 hover:file:bg-honey-200 cursor-pointer"
                />
                <p className="text-[10px] text-amberBrown-400 mt-1">
                  Stored securely in Firebase Cloud Storage under <code className="bg-cream-100 px-1 rounded">products/</code>.
                </p>
              </div>

              <div>
                <label className="block font-bold text-amberBrown-900 mb-1">
                  Or Direct Image URL
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
                  className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:ring-2 focus:ring-honey-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Health, Ingredients & Storage */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-base text-amberBrown-950 pb-2 border-b border-honey-100">
            Product Details & Guidelines
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Ingredients</label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Benefits</label>
              <textarea
                rows={2}
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full p-3 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-amberBrown-900">Storage Instructions</label>
              <input
                type="text"
                name="storage_instructions"
                value={formData.storage_instructions}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-honey-100 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-amberBrown-900">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="accent-honey-600 w-4 h-4 rounded"
            />
            <span>Mark as Featured Product (Home Page)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-amberBrown-900">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="accent-natureGreen-600 w-4 h-4 rounded"
            />
            <span>Active in Storefront</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-cream-50 hover:bg-honey-100 text-amberBrown-800 font-bold rounded-2xl border border-honey-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black rounded-2xl shadow-honey-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-75"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Product...' : (isEdit ? 'Update Product' : 'Create Product')}</span>
          </button>
        </div>

      </form>

    </div>
  )
}
