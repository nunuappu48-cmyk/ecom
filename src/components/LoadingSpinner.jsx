import React from 'react'
import { AppLoadingScreen } from './AppLoadingScreen'
import { Loader2 } from 'lucide-react'

export const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return <AppLoadingScreen text={text} />
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div className="relative flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-semibold text-slate-600 animate-pulse tracking-wide font-sans">
          {text}
        </p>
      )}
    </div>
  )
}
