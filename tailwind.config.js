/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#005B94',
        'bg-raised': '#003F66',
        'bg-card': '#1f2a23',
        fg: '#eff1f3',
        'fg-muted': 'oklch(0.68 0.01 110)',
        'fg-dim': 'oklch(0.5 0.01 120)',
        accent: 'oklch(0.85 0.14 125)',
        'accent-ink': '#005B94',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Instrument Serif"', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderColor: {
        hairline: 'rgba(240, 238, 225, 0.08)',
        'hairline-strong': 'rgba(240, 238, 225, 0.16)',
      },
      animation: {
        pulse: 'pulse 2.4s infinite ease-out',
        float: 'float 6s ease-in-out infinite',
        portraitSpin: 'portraitSpin 6s linear infinite',
        portraitPulse: 'portraitPulse 3.2s ease-in-out infinite',
        taglineShift: 'taglineShift 8s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 3px rgba(195, 230, 120, 0.12)' },
          '50%': { boxShadow: '0 0 0 6px rgba(195, 230, 120, 0.04)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        portraitSpin: { to: { transform: 'rotate(360deg)' } },
        portraitPulse: {
          '0%, 100%': { opacity: 0.45, filter: 'blur(22px)' },
          '50%': { opacity: 0.85, filter: 'blur(32px)' },
        },
        taglineShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
