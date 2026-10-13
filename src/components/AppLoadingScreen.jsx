import React from 'react'

export const AppLoadingScreen = ({
  text = "Loading the latest collections & deals...",
  subtext = "YOUR ULTIMATE SHOPPING DESTINATION",
  fadeOut = false
}) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #EFF6FF 100%)'
      }}
    >
      {/* Subtle modern mesh background */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

      {/* Ambient Radial Glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-400/15 blur-3xl pointer-events-none animate-pulse-subtle" />

      {/* Centered Brand Stack */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm mx-auto">

        {/* Logo Badge */}
        <div className="relative mb-5">
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-4 shadow-xl border border-blue-100 ring-4 ring-blue-500/10 flex items-center justify-center transform transition-transform hover:scale-105">
            <img
              src="/logo.svg"
              alt="EcomCenter Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Pulse Ripple */}
          <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/30 animate-ping pointer-events-none opacity-40" />
        </div>

        {/* Brand Name */}
        <div className="space-y-1 mt-1">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            ECOM<span className="text-blue-600">CENTER</span>
          </h1>

          <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
            {subtext}
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="mt-7 w-48 sm:w-56 space-y-2.5">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 rounded-full animate-ecom-progress" />
          </div>

          <p className="text-xs text-slate-600 font-medium tracking-wide">
            {text}
          </p>
        </div>

      </div>
    </div>
  )
}
