import { neonSql } from '../lib/neon'
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
    const items = getLocalCustomProducts().filter(p => p.id !== id && p.slug !== id)
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Failed to remove product locally:', err)
  }
}

const getAllHouseholdProducts = () => {
  const custom = getLocalCustomProducts()
  const map = new Map()
  HOUSEHOLD_PRODUCTS.forEach(p => map.set(p.id, p))
  custom.forEach(p => map.set(p.id, p))
  return Array.from(map.values())
}

export const productService = {
  async getProducts({ category, search, sortBy, isFeatured } = {}) {
    let prods = []
    let neonQueried = false

    // 1. Fetch from Neon Serverless Postgres
    if (neonSql) {
      try {
        const rows = await neonSql`SELECT * FROM public.products WHERE is_active = true ORDER BY created_at DESC`
        if (Array.isArray(rows)) {
          prods = rows
          neonQueried = true
        }
      } catch (neonErr) {
        console.warn('Neon query warning, falling back to local storage:', neonErr.message)
      }
    }

    // 2. Fallback to custom products only if Neon is offline or unconfigured
    if (!neonQueried && (!prods || prods.length === 0)) {
      prods = getAllHouseholdProducts()
    }

    // Apply in-memory filters
    let list = [...prods]
    if (isFeatured) {
      list = list.filter(p => p.is_featured)
    }

    if (category && category !== 'All') {
      list = list.filter(p => p.category?.toLowerCase().includes(category.toLowerCase()))
    }

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
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

    return list
  },

  async getProductBySlug(slug) {
    if (neonSql) {
      try {
        const rows = await neonSql`SELECT * FROM public.products WHERE slug = ${slug} OR id::text = ${slug} LIMIT 1`
        if (rows && rows.length > 0) {
          return rows[0]
        }
      } catch (err) {
        console.warn('Neon slug fetch warning:', err.message)
      }
    }

    const all = getAllHouseholdProducts()
    return all.find(p => p.slug === slug || p.id === slug) || null
  },

  async createProduct(productData) {
    const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const id = productData.id || `p-${Date.now()}`
    const newProduct = {
      ...productData,
      id,
      slug,
      rating: productData.rating || 5.0,
      reviews_count: productData.reviews_count || 0,
      is_featured: Boolean(productData.is_featured),
      is_active: productData.is_active !== undefined ? productData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save locally
    saveLocalCustomProduct(newProduct)

    // Insert into Neon
    if (neonSql) {
      try {
        const [inserted] = await neonSql`
          INSERT INTO public.products (
            name, slug, description, price, compare_price, weight, category,
            image_url, rating, stock, ingredients, benefits, storage_instructions,
            is_featured, is_active
          ) VALUES (
            ${newProduct.name},
            ${newProduct.slug},
            ${newProduct.description || ''},
            ${Number(newProduct.price)},
            ${newProduct.compare_price ? Number(newProduct.compare_price) : null},
            ${newProduct.weight || 'Standard'},
            ${newProduct.category},
            ${newProduct.image_url || null},
            ${Number(newProduct.rating || 5.0)},
            ${Number(newProduct.stock || 50)},
            ${newProduct.ingredients || ''},
            ${newProduct.benefits || ''},
            ${newProduct.storage_instructions || ''},
            ${Boolean(newProduct.is_featured)},
            ${newProduct.is_active !== false}
          )
          RETURNING *
        `
        if (inserted) return inserted
      } catch (neonErr) {
        console.warn('Neon createProduct warning:', neonErr.message)
      }
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
    const found = custom.find(p => p.id === id || p.slug === id) || HOUSEHOLD_PRODUCTS.find(p => p.id === id || p.slug === id)
    if (found) {
      saveLocalCustomProduct({ ...found, ...payload })
    }

    // Update in Neon
    if (neonSql) {
      try {
        if (payload.price !== undefined) {
          await neonSql`UPDATE public.products SET price = ${Number(payload.price)}, updated_at = now() WHERE id::text = ${id} OR slug = ${id}`
        }
        if (payload.name !== undefined) {
          await neonSql`UPDATE public.products SET name = ${payload.name}, updated_at = now() WHERE id::text = ${id} OR slug = ${id}`
        }
        if (payload.stock !== undefined) {
          await neonSql`UPDATE public.products SET stock = ${Number(payload.stock)}, updated_at = now() WHERE id::text = ${id} OR slug = ${id}`
        }
        if (payload.description !== undefined) {
          await neonSql`UPDATE public.products SET description = ${payload.description}, updated_at = now() WHERE id::text = ${id} OR slug = ${id}`
        }
        if (payload.category !== undefined) {
          await neonSql`UPDATE public.products SET category = ${payload.category}, updated_at = now() WHERE id::text = ${id} OR slug = ${id}`
        }
        if (payload.image_url !== undefined) {
          await neonSql`UPDATE public.products SET image_url = ${payload.image_url}, updated_at = now() WHERE id::text = ${id} OR slug = ${id}`
        }
      } catch (neonErr) {
        console.warn('Neon updateProduct warning:', neonErr.message)
      }
    }

    return { ...found, ...payload }
  },

  async deleteProduct(id) {
    removeLocalCustomProduct(id)

    if (neonSql) {
      try {
        await neonSql`DELETE FROM public.products WHERE id::text = ${id} OR slug = ${id}`
      } catch (neonErr) {
        console.warn('Neon deleteProduct warning:', neonErr.message)
      }
    }

    return true
  },

  async uploadProductImage(file, customName) {
    return await uploadProductImageToFirebase(file, customName)
  }
}
