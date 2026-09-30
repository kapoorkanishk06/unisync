import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        'text-mute': 'var(--text-mute)',
        'brand-1': 'var(--brand-1)',
        'brand-2': 'var(--brand-2)',
        'risk-critical': 'var(--risk-critical)',
        'risk-high': 'var(--risk-high)',
        'risk-medium': 'var(--risk-medium)',
        'risk-low': 'var(--risk-low)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px -8px var(--brand-1)/30%' },
          '100%': { boxShadow: '0 0 40px -8px var(--brand-1)/60%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
