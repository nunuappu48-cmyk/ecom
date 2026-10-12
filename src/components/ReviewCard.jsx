import React from 'react'
import { Star, CheckCircle2, Quote } from 'lucide-react'
import { formatDate, getInitials } from '../utils/formatters'

export const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-honey-200/80 shadow-soft hover:shadow-honey-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Decorative Quote Mark */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-honey-200/60 pointer-events-none group-hover:text-honey-300 transition-colors" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? 'fill-honey-500 text-honey-500'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-amberBrown-900 ml-1">
            {review.rating}.0
          </span>
        </div>

        {/* Comment */}
        <p className="text-xs sm:text-sm text-amberBrown-700 leading-relaxed italic mb-4 font-normal">
          "{review.comment}"
        </p>
      </div>

      {/* Customer Info */}
      <div className="pt-3 border-t border-honey-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-gold-gradient text-amberBrown-950 font-black text-xs flex items-center justify-center shadow-2xs">
            {getInitials(review.user_name || 'Customer')}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-xs sm:text-sm text-amberBrown-950">
                {review.user_name || 'Verified Customer'}
              </h4>
              <CheckCircle2 className="w-3.5 h-3.5 text-natureGreen-700 fill-natureGreen-100" />
            </div>
            <p className="text-[10px] text-amberBrown-400">
              Verified Buyer {review.created_at && `• ${formatDate(review.created_at)}`}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
