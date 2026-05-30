/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#208AEF',
        'primary-dark': '#1a7ad4',
        'primary-deeper': '#0A4F8A',
        accent: '#FF7F3B',
        'accent-dark': '#e56520',
      },
    },
  },
  plugins: [],
};
