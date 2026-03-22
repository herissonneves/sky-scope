import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default [
  // Ignorar arquivos
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Configuração recomendada do ESLint
  js.configs.recommended,

  // Configurações recomendadas do TypeScript ESLint
  ...tseslint.configs.recommended,

  // Configuração para arquivos do projeto
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
    },

    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      // Regras do plugin import
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\.css$', '\\.module\\.css$'],
        },
      ],
      'import/named': 'error',
      'import/default': 'error',
      'import/no-duplicates': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
];
