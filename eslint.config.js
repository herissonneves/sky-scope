import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

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
      },
    },

    plugins: {
      import: importPlugin,
    },

    rules: {
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
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
];
