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
        'code': {
          'blue': '#00D1FF',
          'purple': '#7B61FF',
          'green': '#00FFA3',
          'orange': '#FF6B00',
          'red': '#FF3B5F',
        },
        'bg': {
          'dark': '#0F172A',
          'card': '#1E293B',
        },
        'text': {
          'primary': '#F8FAFC',
          'muted': '#94A3B8',
        },
        'codeopoly': {
          'brown': '#8B4513',
          'light-blue': '#87CEEB',
          'pink': '#FF69B4',
          'orange': '#FF8C00',
          'red': '#DC143C',
          'yellow': '#FFD700',
          'green': '#228B22',
          'dark-blue': '#00008B',
        },
        'codeopoly-cyan': '#06B6D4',
        'codeopoly-blue': '#3B82F6',
        'codeopoly-yellow': '#FBBF24',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.5' }],
        'lg': ['20px', { lineHeight: '1.5' }],
        'xl': ['24px', { lineHeight: '1.5' }],
        '2xl': ['32px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
      },
      boxShadow: {
        'cyan-glow': '0 0 40px rgba(6, 182, 212, 0.3)',
        'yellow-glow': '0 0 40px rgba(251, 191, 36, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 1s infinite',
      }
    },
  },
  plugins: [],
}

