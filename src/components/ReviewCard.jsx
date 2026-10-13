import React from 'react'
import { Star, CheckCircle2, Quote } from 'lucide-react'
import { formatDate, getInitials } from '../utils/formatters'

export const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Decorative Quote Mark */}
      <Quote className="absolute top-4 right-4 w-7 h-7 text-slate-200/80 pointer-events-none group-hover:text-blue-200 transition-colors" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-900 ml-1">
            {review.rating}.0
          </span>
        </div>

        {/* Comment */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4 font-normal">
          "{review.comment}"
        </p>
      </div>

      {/* Customer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {getInitials(review.user_name || 'Customer')}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                {review.user_name || 'Verified Customer'}
              </h4>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Verified Buyer {review.created_at && `• ${formatDate(review.created_at)}`}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
