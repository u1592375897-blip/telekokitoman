/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
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
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        /* legacy hardcoded cyber colors (still used in some components) */
        cyber: {
          black:  '#0a0a0f',
          dark:   '#0d0d1a',
          cyan:   '#00f5ff',
          purple: '#bf00ff',
          pink:   '#ff00aa',
          blue:   '#0066ff',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Quicksand', 'sans-serif'],
        body:    ['Inter', 'Nunito', 'sans-serif'],
        sans:    ['Inter', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius, 0.5rem)',
        md: 'calc(var(--radius, 0.5rem) - 2px)',
        sm: 'calc(var(--radius, 0.5rem) - 4px)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px hsl(var(--primary)/.3), 0 0 20px hsl(var(--primary)/.15)' },
          '50%':       { boxShadow: '0 0 20px hsl(var(--primary)/.6), 0 0 40px hsl(var(--primary)/.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'cyber-grid': `linear-gradient(hsl(var(--primary)/.03) 1px, transparent 1px),
                       linear-gradient(90deg, hsl(var(--primary)/.03) 1px, transparent 1px)`,
      },
      backgroundSize: { grid: '40px 40px' },
    },
  },
  plugins: [],
}
