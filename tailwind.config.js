function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in oklab, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${variableName})`;
  };
}

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
        // Semantic Theme Tokens matching HalaMama System
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        card: {
          DEFAULT: withOpacity('--card'),
          foreground: withOpacity('--card-foreground'),
        },
        popover: {
          DEFAULT: withOpacity('--popover'),
          foreground: withOpacity('--popover-foreground'),
        },
        primary: {
          DEFAULT: withOpacity('--primary'),
          foreground: withOpacity('--primary-foreground'),
        },
        muted: {
          DEFAULT: withOpacity('--muted'),
          foreground: withOpacity('--muted-foreground'),
        },
        border: withOpacity('--border'),
        input: withOpacity('--input'),
        ring: withOpacity('--ring'),
        sidebar: {
          DEFAULT: withOpacity('--sidebar'),
          foreground: withOpacity('--sidebar-foreground'),
          border: withOpacity('--sidebar-border'),
        },
        // Functional Status Colors
        success: {
          DEFAULT: withOpacity('--success'),
          foreground: withOpacity('--success-foreground'),
        },
        warning: {
          DEFAULT: withOpacity('--warning'),
          foreground: withOpacity('--warning-foreground'),
        },
        destructive: {
          DEFAULT: withOpacity('--destructive'),
          foreground: withOpacity('--destructive-foreground'),
        },
        info: {
          DEFAULT: withOpacity('--info'),
          foreground: withOpacity('--info-foreground'),
        },
        // HalaMama Brand Palette
        brand: {
          50: '#f2f7f7',
          100: '#e0efee',
          200: '#c3dedd',
          300: '#9fc7c6',
          400: '#85afae',
          500: '#85afae', // Exact primary Light #85AFAE
          600: '#6e9897',
          700: '#547b7a',
          800: '#3d5c5b',
          900: '#2a403f',
          950: '#102928',
        },
        // Surface aliases
        surface: {
          DEFAULT: withOpacity('--card'),
          secondary: withOpacity('--card'),
          tertiary: withOpacity('--muted'),
          elevated: withOpacity('--card'),
          hover: withOpacity('--muted'),
          border: withOpacity('--border'),
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
          'in-progress': 'oklch(0.72 0.14 210)',
          pending: 'oklch(0.78 0.17 70)',
          'follow-up': '#a855f7',
          resolved: 'oklch(0.7 0.16 165)',
        },
        // Internal Whisper
        whisper: {
          bg: 'oklch(0.78 0.17 70 / 12%)',
          border: 'oklch(0.78 0.17 70 / 30%)',
          text: 'oklch(0.78 0.17 70)',
        },
        // SLA States
        sla: {
          safe: 'oklch(0.7 0.16 165)',
          warning: 'oklch(0.78 0.17 70)',
          critical: 'oklch(0.64 0.24 25)',
        },
      },
      fontFamily: {
        sans: ['"Avenir Next LT Pro"', '"Avenir Next"', 'Avenir', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.85rem' }],
      },
      spacing: {
        'sidebar-expanded': '260px',
        'sidebar-collapsed': '68px',
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
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'glow-brand': '0 0 20px rgba(133, 175, 174, 0.25)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.15)',
      },
    },
  },
  plugins: [],
}
