/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F4',
        warm: '#F3EDE6',
        burgundy: {
          DEFAULT: '#7D2040',
          light: '#9E3558',
          dark: '#5C1730',
        },
        charcoal: '#2C2C2C',
        muted: '#6B6B6B',
        border: '#E5DDD5',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
