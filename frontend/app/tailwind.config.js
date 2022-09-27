/** @type {import('tailwindcss').Config} */
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
      'white': '#FFFFFF',
      'black': '#000000',
    },
    fontFamily: {
      sans: ['Aldrich', 'Apple Color Emoji']
    },
    extend: {},
  },
  plugins: [],
}
