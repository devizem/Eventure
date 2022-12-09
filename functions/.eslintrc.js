module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'object-curly-spacing': ['error', 'always'],
    'import/no-unresolved': 0,
    indent: ['error', 2],
    'require-jsdoc': 'off',
    'quote-props': ['error', 'as-needed'],
    'max-len': [
      'error',
      { code: 120, ignoreTrailingComments: true, ignoreUrls: true },
    ],
  },
};