const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', ...fontFamily.sans],
        lora: ['var(--font-lora)', ...fontFamily.serif],
        sans: ['var(--font-poppins)', ...fontFamily.sans],
        serif: ['var(--font-lora)', ...fontFamily.serif],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            lineHeight: '1.75',
            fontSize: '1.125rem',
            fontFamily: 'var(--font-lora)',
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginTop: '3rem',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-poppins)',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-poppins)',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontFamily: 'var(--font-poppins)',
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-poppins)',
            },
            h5: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-poppins)',
            },
            h6: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: '1rem',
              lineHeight: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-poppins)',
            },
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              lineHeight: '1.75',
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.blue.700'),
                textDecoration: 'underline',
              },
            },
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            em: {
              fontStyle: 'italic',
            },
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: theme('colors.gray.600'),
              borderLeftWidth: '0.25rem',
              borderLeftColor: theme('colors.blue.500'),
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6rem',
              marginBottom: '1.6rem',
              paddingLeft: '1rem',
              backgroundColor: theme('colors.blue.50'),
              padding: '1rem',
              borderRadius: '0.5rem',
            },
            'blockquote p:first-of-type::before': {
              content: 'open-quote',
            },
            'blockquote p:last-of-type::after': {
              content: 'close-quote',
            },
            ul: {
              listStyleType: 'disc',
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.625rem',
            },
            ol: {
              listStyleType: 'decimal',
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.625rem',
            },
            'ul > li': {
              position: 'relative',
              paddingLeft: '0.375rem',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            'ol > li': {
              position: 'relative',
              paddingLeft: '0.375rem',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            'li > p': {
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
            },
            img: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderRadius: '0.75rem',
              boxShadow: theme('boxShadow.lg'),
            },
            pre: {
              color: theme('colors.gray.50'),
              backgroundColor: theme('colors.gray.900'),
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875rem',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.75rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: 'none',
            },
            'pre code::after': {
              content: 'none',
            },
            code: {
              color: theme('colors.gray.900'),
              backgroundColor: theme('colors.gray.100'),
              fontWeight: '600',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              paddingTop: '0.25rem',
              paddingBottom: '0.25rem',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            hr: {
              borderColor: theme('colors.gray.200'),
              borderTopWidth: 1,
              marginTop: '3rem',
              marginBottom: '3rem',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875rem',
              lineHeight: '1.7142857',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.gray.300'),
            },
            'thead th': {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.gray.200'),
            },
            'tbody td': {
              verticalAlign: 'baseline',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-lead': theme('colors.gray.400'),
            '--tw-prose-links': theme('colors.blue.400'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.gray.400'),
            '--tw-prose-bullets': theme('colors.gray.600'),
            '--tw-prose-hr': theme('colors.gray.700'),
            '--tw-prose-quotes': theme('colors.gray.100'),
            '--tw-prose-quote-borders': theme('colors.blue.400'),
            '--tw-prose-captions': theme('colors.gray.400'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-pre-code': theme('colors.gray.300'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.600'),
            '--tw-prose-td-borders': theme('colors.gray.700'),
            color: theme('colors.gray.300'),
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            h4: {
              color: theme('colors.white'),
            },
            h5: {
              color: theme('colors.white'),
            },
            h6: {
              color: theme('colors.white'),
            },
            strong: {
              color: theme('colors.white'),
            },
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.blue.400'),
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.white'),
              backgroundColor: theme('colors.gray.800'),
            },
            pre: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.800'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            'thead th': {
              color: theme('colors.white'),
              borderBottomColor: theme('colors.gray.600'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.700'),
            },
          },
        },
      }),
      keyframes: {
        'background-gradient': {
          '0%, 100%': {
            transform: 'translate(var(--tx-1), var(--ty-1))',
          },
          '25%': {
            transform: 'translate(var(--tx-2), var(--ty-2))',
          },
          '50%': {
            transform: 'translate(var(--tx-3), var(--ty-3))',
          },
          '75%': {
            transform: 'translate(var(--tx-4), var(--ty-4))',
          },
        },
      },
      animation: {
        'background-gradient': 'background-gradient 15s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
