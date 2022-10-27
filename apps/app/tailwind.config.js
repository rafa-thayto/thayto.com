const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['apps/app/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      Poppins: ['Poppins', 'sans-serif'],
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      serif: ['Lora', ...defaultTheme.fontFamily.serif],
    },

    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
