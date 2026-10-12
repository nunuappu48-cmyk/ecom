import React from 'react'
import { AppLoadingScreen } from './AppLoadingScreen'

export const LoadingSpinner = ({ size = 'md', text = 'Loading pure honey...', fullScreen = false }) => {
  if (fullScreen) {
    return <AppLoadingScreen text={text} />
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-2.5">
      <div className="relative flex items-center justify-center">
        <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
          <img
            src="/3004.gif"
            alt="Flying Bee"
            className="w-full h-full object-contain animate-float-slow filter drop-shadow-[0_4px_8px_rgba(183,121,31,0.25)]"
          />
        </div>
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-bold text-amberBrown-800 animate-pulse tracking-wide font-sans">
          {text}
        </p>
      )}
    </div>
  )
}
