/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Primary E-Commerce Palette (Vibrant Electric Blue / Indigo)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB', // Primary Brand Blue
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          950: '#0B132B',
        },
        // Aliased honey tokens to modern e-commerce blue so existing components seamlessly inherit the new theme
        honey: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          950: '#0B132B',
        },
        // Clean neutral background layers
        cream: {
          50: '#FFFFFF',
          100: '#F8FAFC', // Slate 50
          200: '#F1F5F9', // Slate 100
          300: '#E2E8F0', // Slate 200
        },
        // Modern dark slate text / card neutrals (replacing rustic brown)
        amberBrown: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // Deep modern Slate 900
          950: '#020617', // Midnight Slate 950
        },
        // Trust and Deal highlights (Fresh Emerald)
        natureGreen: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'], // Standardized to sleek sans-serif
        accent: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'honey-sm': '0 2px 10px -2px rgba(37, 99, 235, 0.12)',
        'honey-md': '0 8px 24px -4px rgba(37, 99, 235, 0.16)',
        'honey-lg': '0 16px 36px -6px rgba(29, 78, 216, 0.22)',
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 12px 32px -4px rgba(15, 23, 42, 0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 1.5s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      }
    },
  },
  plugins: [],
}
