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

    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            pre: {
              color: theme('colors.gray.900'),
              backgroundColor: theme('colors.slate.200'),
            },
            'pre code::before': {
              'padding-left': 'unset',
            },
            'pre code::after': {
              'padding-right': 'unset',
            },
            code: {
              backgroundColor: theme('colors.slate.200'),
              color: theme('colors.gray.900'),
              fontWeight: '400',
              'border-radius': '0.25rem',
              'padding-top': '0.1rem',
              'padding-bottom': '0.1rem',
            },
            'code::before': {
              content: '""',
              'padding-left': '0.35rem',
            },
            'code::after': {
              content: '""',
              'padding-right': '0.35rem',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
