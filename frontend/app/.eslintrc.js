// module.exports = {
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: 'tsconfig.json',
//     tsconfigRootDir: __dirname,
//     sourceType: 'module',
//     ecmaVersion: 2020,
//     ecmaFeatures: {
//       jsx: true, // Allows for the parsing of JSX
//     },
//   },
//   settings: {
//     react: {
//       version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
//     },
//   },
//   plugins: ['@typescript-eslint'],
//   extends: [
//     'plugin:@typescript-eslint/recommended',
//     'plugin:@typescript-eslint/recommended-requiring-type-checking',
//     'plugin:prettier/recommended',
//   ],
//   root: true,
//   env: {
//     node: true,
//     jest: true,
//   },
//   ignorePatterns: ['.eslintrc.js', '*spec.ts'],
//   rules: {
//     '@typescript-eslint/naming-convention': [
//       'error',
//       {
//         selector: ['variable', 'parameter'],
//         format: ['camelCase'],
//       },
//       {
//         selector: ['function', 'interface', 'class'],
//         format: ['PascalCase'],
//       },
//     ],
//     '@typescript-eslint/no-unsafe-assignment': 'error',
//   },
// };
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
  ],
};
