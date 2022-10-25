/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['apps/app/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
