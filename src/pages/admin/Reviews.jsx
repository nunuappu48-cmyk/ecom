import React, { useState, useEffect } from 'react'
import { Trash2, Star, MessageSquare, Mail, Users, CheckCircle2 } from 'lucide-react'
import { reviewService, newsletterService } from '../../services/reviewService'
import { useToast } from '../../context/ToastContext'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { formatDate } from '../../utils/formatters'

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')
  const { addToast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [revs, subs] = await Promise.all([
        reviewService.getAllReviewsAdmin(),
        newsletterService.getAllSubscribersAdmin()
      ])
      setReviews(revs)
      setSubscribers(subs)
    } catch (err) {
      console.error('Error fetching reviews and subscribers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (id) => {
    try {
      await reviewService.deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
      addToast('Review deleted', 'info')
    } catch (err) {
      addToast('Failed to delete review', 'error')
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading customer feedback..." />
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
          Reviews & Newsletter Subscribers
        </h1>
        <p className="text-xs sm:text-sm text-amberBrown-600">
          Moderate verified honey buyer testimonials and manage newsletter growth.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-honey-200 pb-2">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'reviews'
              ? 'bg-amberBrown-900 text-honey-200'
              : 'bg-white text-amberBrown-700 hover:bg-honey-50'
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'subscribers'
              ? 'bg-amberBrown-900 text-honey-200'
              : 'bg-white text-amberBrown-700 hover:bg-honey-50'
          }`}
        >
          Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft space-y-4">
          <div className="divide-y divide-honey-100">
            {reviews.map(review => (
              <div key={review.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-amberBrown-950">
                      {review.user_name}
                    </span>
                    <div className="flex items-center text-honey-500">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating ? 'fill-honey-500' : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-amberBrown-400">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amberBrown-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-2 text-amberBrown-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft space-y-4">
          <div className="divide-y divide-honey-100">
            {subscribers.map((sub, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-honey-600" />
                  <span className="font-bold text-amberBrown-950">{sub.email}</span>
                </div>
                <span className="text-[11px] text-amberBrown-500">
                  Subscribed on {formatDate(sub.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
