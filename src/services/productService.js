import { supabase } from '../lib/supabase'
import { uploadProductImageToFirebase, deleteProductImageFromFirebase } from '../lib/firebase'

export const productService = {
  async getProducts({ category, search, sortBy, isFeatured } = {}) {
    try {
      let query = supabase.from('products').select('*')

      if (isFeatured) {
        query = query.eq('is_featured', true)
      }

      if (category && category !== 'All') {
        query = query.ilike('category', `%${category}%`)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%,ingredients.ilike.%${search}%`)
      }

      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false })
      } else if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (error) {
        console.error('Supabase getProducts error:', error)
        throw error
      }
      return data || []
    } catch (err) {
      console.error('Failed to fetch products from Supabase:', err.message)
      return []
    }
  },

  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error(`Failed to fetch product by slug "${slug}" from Supabase:`, err.message)
      return null
    }
  },

  async createProduct(productData) {
    const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newProduct = {
      ...productData,
      slug,
      rating: productData.rating || 5.0,
      is_featured: Boolean(productData.is_featured),
      is_active: productData.is_active !== undefined ? productData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single()

    if (error) {
      console.error('Supabase createProduct error:', error)
      throw error
    }
    return data
  },

  async updateProduct(id, updates) {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase updateProduct error:', error)
      throw error
    }
    return data
  },

  async deleteProduct(id) {
    // 1. Fetch to get image URL for deletion from Firebase
    const { data: prod } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single()

    if (prod?.image_url) {
      await deleteProductImageFromFirebase(prod.image_url)
    }

    // 2. Delete product from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase deleteProduct error:', error)
      throw error
    }
    return true
  },

  async uploadProductImage(file, customName) {
    return await uploadProductImageToFirebase(file, customName)
  }
}
