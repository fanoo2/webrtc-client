const eslint = require('eslint');

module.exports = [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Critical errors only for production
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // TypeScript critical rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true 
      }],
      
      // Warnings for code quality (don't fail build)
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off', // Allow console for logging
      'quotes': 'off', // Don't enforce quotes for now
      'semi': 'off', // Don't enforce semicolons for now
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '*.js'],
  },
];