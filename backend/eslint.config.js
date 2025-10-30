import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', 'dist', 'coverage'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'prefer-destructuring': ['warn', { object: true, array: false }],
    },
  },
];
