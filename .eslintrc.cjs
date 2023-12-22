/* eslint-env node */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:jest/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint', 'jest'],
  root: true,
  rules: {
    'prefer-const': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T', 'K'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: ['memberLike', 'variableLike'],
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['can', 'did', 'has', 'is', 'must', 'needs', 'should', 'will'],
      },
    ],
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'jest.config.cjs',
    'e2e/jest-e2e.config.cjs',
    '.prettierrc.cjs',
    'node_modules',
    'dist',
    'old',
  ],
  overrides: [
    {
      files: ['e2e', 'src/**/*.spec.ts'],
      env: { jest: true },
    },
  ],
};
