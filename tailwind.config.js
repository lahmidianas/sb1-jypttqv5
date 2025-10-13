/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9DC44D',
        secondary: '#333333',
        sand: '#F4E7D3',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};