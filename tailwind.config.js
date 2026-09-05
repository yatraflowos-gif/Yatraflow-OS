/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05070d',
          900: '#0a0e17',
          850: '#0d1220',
          800: '#111827',
          700: '#1a2332',
          600: '#2a3547',
        },
        accent: {
          500: '#2563eb',
          600: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
