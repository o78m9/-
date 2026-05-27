const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['var(--font-arabic)', ...fontFamily.sans],
        fraunces: ['var(--font-fraunces)', ...fontFamily.serif],
        metric:   ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        // ── Hero dark palette (Palette A — Warm Premium) ──────────
        hero: {
          deep:   '#0A1F1C',
          soft:   '#142B27',
          gold:   '#D4A574',
          'gold-dim': '#8A6040',
          sage:   '#7FB5A8',
          text:   '#F5EFE6',
          muted:  '#8A9B95',
          border: 'rgba(212,165,116,0.15)',
        },
        // ── Editorial landing palette ──────────────────────────────
        ink:    '#1A1815',
        cream:  '#F5F1E8',
        paper:  '#FFFCF5',
        forest: '#1F3D36',
        moss:   '#4A6B5C',
        copper: '#B8743D',
        rust:   '#8B3A1F',
        line:   '#E8DFD0',
        mute:   '#6B6359',
        // ── Legacy app palette (dashboard / campaign pages) ────────
        awda: {
          bg:           '#FAFAF7',
          white:        '#FFFFFF',
          text:         '#0A0A0A',
          sec:          '#5C5C5C',
          teal:         '#0F4C44',
          'teal-light': '#E6F0EE',
          amber:        '#B8761A',
          border:       '#E8E6E0',
          dark:         '#0A1F1C',
        },
        brand: {
          50:  '#E6F0EE',
          100: '#C2D9D5',
          200: '#9BC3BC',
          300: '#70ACA2',
          400: '#4A9689',
          500: '#278070',
          600: '#1A6A5B',
          700: '#0F4C44',
          800: '#083830',
          900: '#02241C',
        },
        // ── shadcn semantic tokens ──────────────────────────────────
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      maxWidth: {
        content: '1180px',
      },
      keyframes: {
        fadeIn:           { from: { opacity: '0' },                                      to: { opacity: '1' } },
        slideUp:          { from: { opacity: '0', transform: 'translateY(12px)' },       to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown:        { from: { opacity: '0', transform: 'translateY(-8px)' },       to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:          { from: { opacity: '0', transform: 'scale(0.95)' },            to: { opacity: '1', transform: 'scale(1)' } },
        'accordion-down': { from: { height: '0' },                                       to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' },  to: { height: '0' } },
        shimmer:          { from: { backgroundPosition: '-200% 0' },                     to: { backgroundPosition: '200% 0' } },
        blink:            { '0%, 100%': { opacity: '1' },                                '50%': { opacity: '0' } },
      },
      animation: {
        'fade-in':        'fadeIn 0.3s ease-out',
        'slide-up':       'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down':     'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':       'scaleIn 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        shimmer:          'shimmer 2s linear infinite',
        blink:            'blink 1s step-end infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        card:       '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
        editorial:  '0 30px 60px -20px rgba(26,24,21,0.15)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
