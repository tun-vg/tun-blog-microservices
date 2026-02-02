module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'no-undef': 'error', // Đảm bảo cảnh báo biến không định nghĩa
    'no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
    'react/jsx-curly-newline': 'off', // Tắt kiểm tra newline trong JSX
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'prettier/prettier': [
      'error',
      {
        arrowParent: 'always',
        trailingComma: 'es5',
        printWith: 120,
        semi: true,
        singleQuote: true,
        jsxSingleQuote: false,
        useTabs: false,
        plugins: ['prettier-plugin-tailwindcss'],
        pluginSearchDirs: false,
      },
    ],
  },
};
