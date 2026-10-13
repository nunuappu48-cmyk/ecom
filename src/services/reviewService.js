import { neonSql } from '../lib/neon'

export const reviewService = {
  async getProductReviews(productId) {
    if (!neonSql) return []
    try {
      if (productId) {
        return await neonSql`SELECT * FROM public.reviews WHERE product_id::text = ${productId} ORDER BY created_at DESC`
      }
      return await neonSql`SELECT * FROM public.reviews ORDER BY created_at DESC`
    } catch (err) {
      console.warn('Neon getProductReviews error:', err.message)
      return []
    }
  },

  async addReview(reviewData) {
    if (!neonSql) return null
    try {
      const [res] = await neonSql`
        INSERT INTO public.reviews (user_name, product_id, rating, comment)
        VALUES (${reviewData.user_name}, ${reviewData.product_id}, ${Number(reviewData.rating)}, ${reviewData.comment})
        RETURNING *
      `
      return res
    } catch (err) {
      console.warn('Neon addReview error:', err.message)
      throw err
    }
  },

  async getAllReviewsAdmin() {
    if (!neonSql) return []
    try {
      return await neonSql`
        SELECT r.*, p.name as product_name, p.image_url as product_image
        FROM public.reviews r
        LEFT JOIN public.products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
      `
    } catch (err) {
      console.warn('Neon getAllReviewsAdmin error:', err.message)
      return []
    }
  },

  async deleteReview(reviewId) {
    if (!neonSql) return false
    try {
      await neonSql`DELETE FROM public.reviews WHERE id::text = ${reviewId}`
      return true
    } catch (err) {
      console.warn('Neon deleteReview error:', err.message)
      return false
    }
  }
}

export const newsletterService = {
  async subscribe(email) {
    if (!neonSql) return { success: true }
    try {
      await neonSql`
        INSERT INTO public.newsletter_subscribers (email)
        VALUES (${email.toLowerCase()})
        ON CONFLICT (email) DO NOTHING
      `
      return { success: true }
    } catch (err) {
      console.warn('Neon subscribe error:', err.message)
      return { success: false, error: err.message }
    }
  },

  async getAllSubscribersAdmin() {
    if (!neonSql) return []
    try {
      return await neonSql`SELECT * FROM public.newsletter_subscribers ORDER BY created_at DESC`
    } catch (err) {
      console.warn('Neon getAllSubscribersAdmin error:', err.message)
      return []
    }
  }
}
