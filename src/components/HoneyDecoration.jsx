import React from 'react'

export const HoneycombPattern = ({ className = "opacity-5" }) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
    <pattern id="honeycomb-pattern" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
      <path
        d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M28 0L28 33L0 50L0 83L28 100L56 83L56 50L28 33"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </pattern>
    <rect width="100%" height="100%" fill="url(#honeycomb-pattern)" />
  </svg>
)

export const BeeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="13" rx="5" ry="7" fill="#F4B400" />
    <path d="M7.5 11H16.5M7.2 14H16.8M8.5 17H15.5" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="5" r="2.5" fill="#3E2723" />
    {/* Wings */}
    <path d="M7 10C4 6 5 2 9 4C11 5 9 9 7 10Z" fill="#FFF4CC" stroke="#F4B400" strokeWidth="0.8" opacity="0.9" />
    <path d="M17 10C20 6 19 2 15 4C13 5 15 9 17 10Z" fill="#FFF4CC" stroke="#F4B400" strokeWidth="0.8" opacity="0.9" />
    {/* Stinger */}
    <path d="M12 20L11 22H13L12 20Z" fill="#3E2723" />
    {/* Antennae */}
    <path d="M10.5 3C9.5 1.5 8 2 8 2M13.5 3C14.5 1.5 16 2 16 2" stroke="#3E2723" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

export const HoneyDropIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.5C12 2.5 5 11 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11 12 2.5 12 2.5Z"
      fill="url(#dropGrad)"
    />
    <path
      d="M15 14C15 16.5 13.5 18.5 11 19"
      stroke="#FFF4CC"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="dropGrad" x1="12" y1="2.5" x2="12" y2="23" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD54F" />
        <stop offset="0.6" stopColor="#F4B400" />
        <stop offset="1" stopColor="#B7791F" />
      </linearGradient>
    </defs>
  </svg>
)
