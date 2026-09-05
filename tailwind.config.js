/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './js/**/*.js',
    './study/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        bgApp: 'var(--bg-app)',
        bgCard: 'var(--bg-card)',
        borderMain: 'var(--border-main)',
        textMain: 'var(--text-main)',
        textSub: 'var(--text-sub)',
        accentCyan: '#06b6d4',
        accentPurple: '#8b5cf6',
        accentRose: '#f43f5e',
        accentAmber: '#f59e0b',
        accentGreen: '#10b981',
        panel: '#0e1322',
        panel2: '#131a2c',
        line: '#1e2740',
        teal: '#06b6d4',
        violet: '#8b5cf6',
        amber: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        rose: {
          DEFAULT: '#f43f5e',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519'
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
