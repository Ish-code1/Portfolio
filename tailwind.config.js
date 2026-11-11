/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Shared base ─────────────────────────────
        base:    '#080b12',
        surface: '#0d1117',
        border:  '#1a2235',
        muted:   '#4a5568',
        text:    '#e2e8f0',
        // ── Domain accent palette ───────────────────
        aiml:    '#00e5ff',   // cyan
        genai:   '#a855f7',   // violet
        mlops:   '#10b981',   // emerald
        software:'#f97316',   // orange
        comms:   '#f59e0b',   // amber / warm
        // ── Utility ─────────────────────────────────
        neural:  '#4ade80',
      },
      fontSize: {
        // type scale
        '2xs': ['0.625rem', '1'],
        xs:    ['0.75rem',  '1.4'],
        sm:    ['0.875rem', '1.5'],
        base:  ['1rem',     '1.6'],
        lg:    ['1.125rem', '1.5'],
        xl:    ['1.25rem',  '1.4'],
        '2xl': ['1.5rem',   '1.3'],
        '3xl': ['1.875rem', '1.2'],
        '4xl': ['2.25rem',  '1.1'],
        '5xl': ['3rem',     '1'],
        '6xl': ['3.75rem',  '1'],
        '7xl': ['4.5rem',   '1'],
        '8xl': ['6rem',     '1'],
        '9xl': ['8rem',     '1'],
      },
      spacing: {
        'nav': '4rem',   // 64px sticky nav height
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in':  'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'blink':   'blink 1.2s step-start infinite',
      },
      backgroundImage: {
        'grid-neural':
          'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-neural': '48px 48px',
      },
    },
  },
  plugins: [],
}
