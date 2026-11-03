/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Halamama Brand Palette - Exact Primary #74A09F (from existing OMS)
        brand: {
          50: '#f2f7f7',
          100: '#e0efee',
          200: '#c3dedd',
          300: '#9cc4c2',
          400: '#74a09f',
          500: '#74a09f', // Exact requested primary #74A09F
          600: '#5d8c8b', // Hover
          700: '#4a7271',
          800: '#3f5c5b',
          900: '#374d4c',
          950: '#1b2a2a',
        },
        // Theme semantic tokens matching Halamama-RMO
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: '#74a09f',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        // Surface & Background (dynamically driven by CSS variables for Dark/Light)
        surface: {
          DEFAULT: 'rgb(var(--surface-default) / <alpha-value>)',
          secondary: 'rgb(var(--surface-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--surface-tertiary) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
        },
        // Channel Colors
        channel: {
          whatsapp: '#25D366',
          instagram: '#E4405F',
          messenger: '#0084FF',
          email: '#6366f1',
        },
        // Status Tags
        status: {
          'in-progress': '#3b82f6',
          pending: '#f59e0b',
          'follow-up': '#a855f7',
          resolved: '#22c55e',
        },
        // Internal Whisper
        whisper: {
          bg: '#fef3c7',
          border: '#f59e0b',
          text: '#92400e',
        },
        // SLA States
        sla: {
          safe: '#22c55e',
          warning: '#f59e0b',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['"Avenir Next LT Pro"', '"Avenir Next"', 'Avenir', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.85rem' }],
      },
      spacing: {
        'segment-1': '240px',
        'segment-2': '320px',
        'segment-4': '380px',
        'navbar': '56px',
      },
      gridTemplateColumns: {
        'care-layout': '240px 320px 1fr 380px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'sla-pulse': 'slaPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slaPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
        'glow-brand': '0 0 20px rgba(133, 175, 174, 0.25)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.15)',
      },
    },
  },
  plugins: [],
}
