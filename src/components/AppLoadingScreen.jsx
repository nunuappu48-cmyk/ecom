import React from 'react'

export const AppLoadingScreen = ({
  text = "Harvesting nature's golden drops...",
  subtext = "100% PURE ARTISANAL HONEY",
  fadeOut = false
}) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 select-none ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #FFFDF5 0%, #FFF7D6 30%, #FEE898 60%, #F59E0B 88%, #451A03 100%)'
      }}
    >
      {/* Honeycomb Hexagon Pattern Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 animate-pulse-slow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="loading-honeycomb"
          width="56"
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.2)"
        >
          <path
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
            fill="none"
            stroke="#92400E"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M28 0L28 33L0 50L0 83L28 100L56 83L56 50L28 33"
            fill="none"
            stroke="#92400E"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#loading-honeycomb)" />
      </svg>

      {/* Floating Golden Pollen Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="pollen-particle p1" />
        <span className="pollen-particle p2" />
        <span className="pollen-particle p3" />
        <span className="pollen-particle p4" />
        <span className="pollen-particle p5" />
      </div>

      {/* Ambient Center Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-honey-400/35 blur-3xl pointer-events-none animate-pulse-subtle" />

      {/* Centered Brand Stack */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm mx-auto">

        {/* Flying Bee + Centered Logo Container */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-2">

          {/* Animated Flying Bee (3004.gif) with Flight Path */}
          <div className="absolute z-20 pointer-events-none bee-flight-container">
            <div className="relative">
              <img
                src="/3004.gif"
                alt="Flying Bee"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_8px_12px_rgba(69,26,3,0.35)]"
              />
              {/* Subtle trailing honey sparkles */}
              <span className="bee-trail t1" />
              <span className="bee-trail t2" />
            </div>
          </div>

          {/* Centered Glowing Logo Badge */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/95 p-3.5 shadow-[0_12px_40px_rgba(183,121,31,0.35)] border-2 border-honey-300 ring-4 ring-honey-400/25 backdrop-blur-md flex items-center justify-center transform transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="Fellas Honey Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          {/* Radial Pulse Ring around Logo */}
          <div className="absolute inset-4 rounded-3xl border-2 border-honey-500/40 animate-ping-slow pointer-events-none" />
        </div>

        {/* Centered Company Name */}
        <div className="space-y-1.5 mt-2">
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-amberBrown-950 tracking-wider drop-shadow-sm">
            FELLAS HONEY
          </h1>

          {/* Gold Decorative Divider with Honey Drop */}
          <div className="flex items-center justify-center gap-2.5 py-1">
            <span className="h-[1.5px] w-8 bg-gradient-to-r from-transparent via-amber-700 to-amber-900 rounded-full" />
            <span className="text-sm">🍯</span>
            <span className="h-[1.5px] w-8 bg-gradient-to-l from-transparent via-amber-700 to-amber-900 rounded-full" />
          </div>

          <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-amberBrown-800/90 font-accent">
            {subtext}
          </p>
        </div>

        {/* Honey Progress Bar */}
        <div className="mt-7 w-48 sm:w-56 space-y-2">
          <div className="w-full h-2 bg-amber-950/15 rounded-full overflow-hidden p-0.5 border border-amber-900/20 backdrop-blur-xs">
            <div className="h-full bg-gradient-to-r from-amber-500 via-honey-400 to-amber-600 rounded-full animate-honey-progress" />
          </div>

          <p className="text-xs text-amberBrown-900 font-semibold tracking-wide animate-pulse">
            {text}
          </p>
        </div>

      </div>

    </div>
  )
}
