/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'code-blue': '#00D1FF',
        'code-purple': '#7B61FF',
        'stack-green': '#10B981',
        'bug-red': '#EF4444',
        'code-green': '#00FFA3',
        'code-orange': '#FF6B00',
        'code-red': '#FF3B5F',
        'bg-dark': '#0F172A',
        'card-bg': '#1E293B',
        'text-primary': '#F8FAFC',
        'text-muted': '#94A3B8',
        'border-subtle': '#334155',
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
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['Inter', 'monospace'],
      },
      spacing: {
        '8px': '8px',
      },
    },
  },
  plugins: [],
}

