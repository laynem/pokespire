/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#cc0000',
          blue: '#0075be',
          yellow: '#ffcb05',
          dark: '#1a1a2e',
        },
      },
      fontFamily: {
        pokemon: ['"Press Start 2P"', 'monospace'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        'flash-white': {
          '0%, 100%': { filter: 'brightness(1)' },
          '40%': { filter: 'brightness(4) saturate(0)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-56px)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pokeball-drop': {
          '0%': { transform: 'translateY(-80px) rotate(-20deg)', opacity: '0' },
          '55%': { transform: 'translateY(0) rotate(340deg)', opacity: '1' },
          '70%': { transform: 'translateY(-12px) rotate(350deg)' },
          '85%': { transform: 'translateY(0) rotate(360deg)' },
          '100%': { transform: 'translateY(0) rotate(360deg)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'faint-fall': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(32px)', opacity: '0' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.18)' },
        },
        'super-effective': {
          '0%': { transform: 'scale(0.5) rotate(-8deg)', opacity: '0' },
          '30%': { transform: 'scale(1.2) rotate(2deg)', opacity: '1' },
          '60%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '0' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'flash-white': 'flash-white 0.35s ease-in-out',
        'float-up': 'float-up 1s ease-out forwards',
        'fade-in': 'fade-in 0.25s ease-in',
        'pokeball-drop': 'pokeball-drop 0.9s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
        'bounce-in': 'bounce-in 0.5s ease-out forwards',
        'faint-fall': 'faint-fall 0.5s ease-in forwards',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'super-effective': 'super-effective 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
