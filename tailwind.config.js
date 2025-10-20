/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        celestialBlack: '#0a0a0a', // softer than pure #000 for better depth
        celestialYellow: '#FFD54F', // warmer yellow glow
        celestialGray: '#9CA3AF',
      },
      backgroundImage: {
        // soft cosmic glow with radial gradient
        'celestial-gradient': 'radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.08), #000000 80%)',
      },
      boxShadow: {
        celestial: '0 0 40px rgba(255, 215, 0, 0.15)', // soft yellow glow
      },
      dropShadow: {
        glow: '0 0 10px rgba(255, 255, 200, 0.4)',
      },
      fontFamily: {
        celestial: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
