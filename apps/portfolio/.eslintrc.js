module.exports = {
  ...require('@thayto/configs/eslint-next'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
