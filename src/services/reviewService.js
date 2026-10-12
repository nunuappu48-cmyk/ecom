import { supabase } from '../lib/supabase'

export const reviewService = {
  async getProductReviews(productId) {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (productId) {
        query = query.eq('product_id', productId)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Supabase getProductReviews error:', err.message)
      return []
    }
  },

  async addReview(reviewData) {
    const newReview = {
      ...reviewData,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([newReview])
      .select()
      .single()

    if (error) {
      console.error('Supabase addReview error:', error)
      throw error
    }
    return data
  },

  async getAllReviewsAdmin() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          product:products(name, slug, image_url)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Supabase getAllReviewsAdmin error:', err.message)
      return []
    }
  },

  async deleteReview(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase deleteReview error:', error)
      throw error
    }
    return true
  }
}

export const newsletterService = {
  async subscribe(email) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.')
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.toLowerCase().trim() }])

    if (error && error.code !== '23505') { // 23505 is unique constraint (already subscribed)
      console.error('Newsletter subscribe error:', error)
      throw error
    }

    return { success: true, message: 'Welcome to the Sweet Loop! 🍯' }
  },

  async getAllSubscribersAdmin() {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Supabase getSubscribers error:', err.message)
      return []
    }
  }
}
