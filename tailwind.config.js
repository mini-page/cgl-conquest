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
        amber: '#f59e0b',
        rose: '#f43f5e'
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
