module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
  ],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['variable', 'parameter'],
        format: ['camelCase'],
      },
      {
        selector: ['function', 'interface', 'class'],
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'error',
  },
};
