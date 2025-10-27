/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary:'#2563eb',
        accent: '#f59e0b',
        dark: '#0f172a',
      }
    },
  },
  plugins: [],
}

