const base = require('@thayto/configs/eslint-next')

module.exports = {
  ...base,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {
    ...base.rules,
    'import/no-extraneous-dependencies': 'off',
  },
}
