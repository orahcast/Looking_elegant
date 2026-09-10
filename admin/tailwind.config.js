/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#d4b896',
          400: '#c9a97a',
          500: '#b8935a',
          600: '#a07840',
        },
        dark: {
          950: '#050403',
          900: '#0a0906',
          800: '#111009',
          700: '#1a1812',
          600: '#242118',
          500: '#2e2b1f',
          400: '#3d3929',
        },
        cream: {
          50:  '#faf8f3',
          100: '#f5f0e8',
          200: '#ede4d3',
        },
        status: {
          available: '#22c55e',
          rented: '#3b82f6',
          cleaning: '#eab308',
        }
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      },
      boxShadow: {
        'gold': '0 0 0 1px rgba(201,169,122,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
