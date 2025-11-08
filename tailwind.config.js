/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'codeopoly': {
          'brown': '#8B4513',
          'light-blue': '#87CEEB',
          'pink': '#FF69B4',
          'orange': '#FF8C00',
          'red': '#DC143C',
          'yellow': '#FFD700',
          'green': '#228B22',
          'dark-blue': '#00008B',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

