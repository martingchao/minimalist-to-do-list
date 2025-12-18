/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
          950: '#0d3311',
        },
        mint: {
          light: '#e0f2e9',
          DEFAULT: '#a8e6cf',
          dark: '#6dd5a0',
        },
        emerald: {
          glow: '#00ff88',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'green-glow': '0 0 20px rgba(76, 175, 80, 0.3)',
        'green-glow-lg': '0 0 40px rgba(76, 175, 80, 0.4)',
      },
      backgroundImage: {
        'green-gradient': 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
        'mint-gradient': 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)',
      }
    },
  },
  plugins: [],
}
