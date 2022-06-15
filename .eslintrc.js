module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },
  ignorePatterns: ['rollup.config.js'],
  rules: {
    indent: ['off', 2],
    'no-unused-vars': 'error',
    'no-console': 'off',
    'no-param-reassign': 0,
    'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'auto' }],
    'class-methods-use-this': 'off',
    'global-require': 0,
    'no-alert': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
