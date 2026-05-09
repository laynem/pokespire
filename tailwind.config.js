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
    },
  },
  plugins: [],
};
