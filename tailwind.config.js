/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e9e5',
          200: '#ccd6d0',
          300: '#adbdb4',
          400: '#89a093',
          500: '#6d8576',
          600: '#576c5f',
          700: '#47584c',
          800: '#3c4a40',
          900: '#293129',
        },
        lavender: {
          50: '#f4f3f9',
          100: '#e9e7f3',
          200: '#d7d4e9',
          300: '#bbb5d8',
          400: '#9990c2',
          500: '#7c71ad',
          600: '#6a5c99',
          700: '#584b7e',
          800: '#4b4067',
          900: '#403957',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}