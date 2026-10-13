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
      setReviews(revs || [])
      setSubscribers(subs || [])
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
    return <LoadingSpinner text="Loading feedback and subscribers..." />
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Customer Reviews & Subscribers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Moderate customer reviews and manage newsletter subscriber lists.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'reviews'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'subscribers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          {reviews.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">No customer reviews yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reviews.map(review => (
                <div key={review.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {review.user_name}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= review.rating ? 'fill-amber-400' : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">No newsletter subscribers yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {subscribers.map((sub, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{sub.email}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Subscribed on {formatDate(sub.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
