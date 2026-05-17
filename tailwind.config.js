/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f0f5',
          100: '#e0e0eb',
          200: '#c2c2d6',
          300: '#9898b8',
          400: '#6e6e99',
          500: '#4a4a7a',
          600: '#383869',
          700: '#282858',
          800: '#1a1a3e',
          900: '#0d0d24',
          950: '#07071a',
        },
        acid: {
          DEFAULT: '#b4ff4e',
          dark:    '#8acc2e',
          light:   '#d4ff8e',
        },
        coral: '#ff6b6b',
        sky:   '#4ecbff',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
        'check-draw': 'checkDraw 0.5s ease forwards',
        'pop':        'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        checkDraw: {
          from: { strokeDashoffset: '100' },
          to:   { strokeDashoffset: '0' },
        },
        pop: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'grid-ink': `linear-gradient(rgba(180,255,78,0.04) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(180,255,78,0.04) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
