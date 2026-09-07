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
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#d4b896',
          400: '#c9a97a',
          500: '#b8935a',
          600: '#a07840',
        },
        dark: {
          900: '#0a0906',
          800: '#111009',
          700: '#1a1812',
          600: '#242118',
          500: '#2e2b1f',
        },
        cream: {
          50:  '#faf8f3',
          100: '#f5f0e8',
          200: '#ede4d3',
        }
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      }
    },
  },
  plugins: [],
}
