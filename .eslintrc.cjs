/* eslint-env node */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'prefer-const': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    '.prettierrc.cjs',
    'node_modules',
    'dist',
    'old',
  ],
};
