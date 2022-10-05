/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'blue': '#00BABC',
      'dark-blue': '#04A3A5',
      'purple': '#0F0F24',
      'purple-light': '#5454B6',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
    fontFamily: {
      sans: ['Aldrich', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}
