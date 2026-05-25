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
        sans: ['var(--font-arabic)', ...fontFamily.sans],
        metric: ['var(--font-inter)', ...fontFamily.sans],
      },
      fontSize: {
        // Display scale — editorial, dominant
        'display-2xl': ['4.5rem',  { lineHeight: '1',    letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1',    letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-lg':  ['3rem',    { lineHeight: '1.05', letterSpacing: '-0.02em',  fontWeight: '600' }],
        'display-md':  ['2.25rem', { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '600' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
        // Hero metric number (like the big dashboard number)
        'metric-hero': ['4.5rem',  { lineHeight: '1',    letterSpacing: '-0.02em', fontWeight: '700' }],
        'metric-lg':   ['3rem',    { lineHeight: '1',    letterSpacing: '-0.015em', fontWeight: '700' }],
        'metric-md':   ['2.25rem', { lineHeight: '1',    letterSpacing: '-0.01em',  fontWeight: '700' }],
      },
      colors: {
        // Brand palette
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // shadcn semantic tokens
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
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
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'mesh-teal': `
          radial-gradient(at 0% 0%, rgba(15, 118, 110, 0.06) 0px, transparent 60%),
          radial-gradient(at 100% 100%, rgba(20, 184, 166, 0.04) 0px, transparent 60%)
        `,
      },
      keyframes: {
        fadeIn:          { from: { opacity: '0' },                                       to: { opacity: '1' } },
        slideUp:         { from: { opacity: '0', transform: 'translateY(12px)' },        to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown:       { from: { opacity: '0', transform: 'translateY(-8px)' },        to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:         { from: { opacity: '0', transform: 'scale(0.95)' },             to: { opacity: '1', transform: 'scale(1)' } },
        'accordion-down':{ from: { height: '0' },                                        to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':  { from: { height: 'var(--radix-accordion-content-height)' },   to: { height: '0' } },
        shimmer:         { from: { backgroundPosition: '-200% 0' },                      to: { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in':        'fadeIn 0.3s ease-out',
        'slide-up':       'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down':     'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':       'scaleIn 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'shimmer':        'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
        'hero': '0 24px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
