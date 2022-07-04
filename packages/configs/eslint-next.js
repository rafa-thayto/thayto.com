module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'next',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json'],
      },
    },
  },
  rules: {
    // defaults
    'import/prefer-default-export': 'off',

    // JSX
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],

    // react
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/jsx-key': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/jsx-props-no-spreading': 'off',

    // next
    '@next/next/no-html-link-for-pages': 'off',
  },
  overrides: [
    {
      // 3) Now we enable eslint-plugin-testing-library rules or preset only for matching files!
      env: {
        jest: true,
      },
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: [
        'plugin:testing-library/react',
        'plugin:jest/recommended',
        'plugin:react/jsx-runtime',
      ],
      rules: {
        'import/no-extraneous-dependencies': [
          'off',
          { devDependencies: ['**/?(*.)+(spec|test).[jt]s?(x)'] },
        ],
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
  ignorePatterns: [
    '**/*.js',
    '**/*.json',
    'node_modules',
    'public',
    'styles',
    '.next',
    'coverage',
    'dist',
    '.turbo',
  ],
}