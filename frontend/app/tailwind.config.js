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
      'white': colors.white,
      'black': colors.black,
      'green': colors.green,
      'gray': colors.gray,
      'red': colors.red,
    },
    fontFamily: {
      sans: ['Aldrich', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}
