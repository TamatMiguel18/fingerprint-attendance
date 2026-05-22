/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parish: {
          light: '#f5f0e6',
          DEFAULT: '#8b4513',
          dark: '#5c2e0b',
        },
        accent: {
          DEFAULT: '#d4af37',
        }
      }
    },
  },
  plugins: [],
}
