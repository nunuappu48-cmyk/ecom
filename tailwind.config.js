/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          50: '#FFFDF5', // Cream
          100: '#FFF9E6',
          200: '#FFF4CC', // Light Honey
          300: '#FFE580',
          400: '#FFD54F',
          500: '#F4B400', // Honey Gold
          600: '#D99B00',
          700: '#B7791F', // Dark Honey
          800: '#8C5A14',
          900: '#5C3A0A',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFFDF5',
          200: '#FFF9EC',
          300: '#FFF2D6',
        },
        amberBrown: {
          50: '#FBF7F5',
          100: '#F3EAE6',
          300: '#D7BCB2',
          600: '#794D3F',
          800: '#4E3027',
          900: '#3E2723', // Dark Brown
        },
        natureGreen: {
          50: '#F4F7EE',
          100: '#E6EED8',
          500: '#6B8E23', // Natural Green / Olive
          600: '#5A781D',
          700: '#476016',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        accent: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'honey-sm': '0 2px 8px -1px rgba(244, 180, 0, 0.15)',
        'honey-md': '0 8px 24px -4px rgba(244, 180, 0, 0.2)',
        'honey-lg': '0 16px 36px -6px rgba(183, 121, 31, 0.25)',
        'soft': '0 4px 20px -2px rgba(62, 39, 35, 0.06)',
        'soft-lg': '0 12px 32px -4px rgba(62, 39, 35, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        drip: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.15)' },
          '100%': { transform: 'scaleY(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 1.5s infinite',
        'drip': 'drip 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
