/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['Orbitron', 'monospace'],
        body: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        brand: {
          cyan:    '#00ffff',
          magenta: '#ff00aa',
          gold:    '#ffe600',
          violet:  '#7700ff',
          emerald: '#00ff88',
          fire:    '#ff4400',
        },
      },
      maxWidth: {
        '8xl': '90rem',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
