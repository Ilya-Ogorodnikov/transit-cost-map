import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  // Игноры вместо .eslintignore
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '.vite/'],
  },

  // Базовые правила для JS
  js.configs.recommended,

  // Рекомендованные правила для TypeScript
  ...tseslint.configs.recommended,

  // Правила/настройки для TS/React
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Общие
      'no-console': 'off',

      // React
      'react/react-in-jsx-scope': 'off', // не нужно с React 17+
      'react/prop-types': 'off',         // у нас TypeScript

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],
    },
  },
]
