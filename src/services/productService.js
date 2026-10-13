import { supabase } from '../lib/supabase'
import { uploadProductImageToFirebase, deleteProductImageFromFirebase } from '../lib/firebase'
import { HOUSEHOLD_PRODUCTS } from '../data/householdProducts'

const LOCAL_PRODUCTS_KEY = 'ecomcenter_custom_products'

const getLocalCustomProducts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveLocalCustomProduct = (newProduct) => {
  try {
    const items = getLocalCustomProducts()
    const idx = items.findIndex(p => p.id === newProduct.id)
    if (idx > -1) {
      items[idx] = newProduct
    } else {
      items.unshift(newProduct)
    }
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Failed to save product locally:', err)
  }
}

const removeLocalCustomProduct = (id) => {
  try {
    const items = getLocalCustomProducts().filter(p => p.id !== id)
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Failed to remove product locally:', err)
  }
}

const getAllHouseholdProducts = () => {
  const custom = getLocalCustomProducts()
  // Merge custom over default by id or slug
  const map = new Map()
  HOUSEHOLD_PRODUCTS.forEach(p => map.set(p.id, p))
  custom.forEach(p => map.set(p.id, p))
  return Array.from(map.values())
}

export const productService = {
  async getProducts({ category, search, sortBy, isFeatured } = {}) {
    let prods = []

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
      if (!error && data && data.length > 0) {
        // If data contains non-honey household items, use it
        const isOldHoneyData = data.every(p => 
          p.category?.toLowerCase().includes('honey') || 
          p.name?.toLowerCase().includes('honey') || 
          p.category === 'Wildflower' ||
          p.category === 'Monofloral'
        )
        if (!isOldHoneyData) {
          prods = data
        }
      }
    } catch (err) {
      console.warn('Supabase query issue, using local catalog:', err.message)
    }

    // Fallback to rich Household Products catalog if Supabase returned old honey or is empty
    if (!prods || prods.length === 0) {
      let list = getAllHouseholdProducts()

      if (isFeatured) {
        list = list.filter(p => p.is_featured)
      }

      if (category && category !== 'All') {
        list = list.filter(p => p.category?.toLowerCase().includes(category.toLowerCase()))
      }

      if (search) {
        const q = search.toLowerCase()
        list = list.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.ingredients?.toLowerCase().includes(q)
        )
      }

      if (sortBy === 'price-asc') {
        list.sort((a, b) => Number(a.price) - Number(b.price))
      } else if (sortBy === 'price-desc') {
        list.sort((a, b) => Number(b.price) - Number(a.price))
      } else if (sortBy === 'rating') {
        list.sort((a, b) => Number(b.rating) - Number(a.rating))
      }

      prods = list
    }

    return prods
  },

  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!error && data && !data.name?.toLowerCase().includes('honey')) {
        return data
      }
    } catch (_) {}

    // Fallback search in household catalog
    const all = getAllHouseholdProducts()
    return all.find(p => p.slug === slug || p.id === slug) || null
  },

  async createProduct(productData) {
    const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const id = productData.id || `h-prod-${Date.now()}`
    const newProduct = {
      ...productData,
      id,
      slug,
      rating: productData.rating || 5.0,
      reviews_count: productData.reviews_count || 1,
      is_featured: Boolean(productData.is_featured),
      is_active: productData.is_active !== undefined ? productData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save locally
    saveLocalCustomProduct(newProduct)

    // Try Supabase insert
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single()
      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase createProduct fallback to local:', err.message)
    }

    return newProduct
  },

  async updateProduct(id, updates) {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    // Update locally
    const custom = getLocalCustomProducts()
    const found = custom.find(p => p.id === id) || HOUSEHOLD_PRODUCTS.find(p => p.id === id)
    if (found) {
      saveLocalCustomProduct({ ...found, ...payload })
    }

    // Try Supabase update
    try {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase updateProduct fallback to local:', err.message)
    }

    return { ...found, ...payload }
  },

  async deleteProduct(id) {
    removeLocalCustomProduct(id)

    try {
      const { data: prod } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single()

      if (prod?.image_url) {
        await deleteProductImageFromFirebase(prod.image_url)
      }

      await supabase.from('products').delete().eq('id', id)
    } catch (_) {}

    return true
  },

  async uploadProductImage(file, customName) {
    return await uploadProductImageToFirebase(file, customName)
  }
}
