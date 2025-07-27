import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // 무시할 파일들
  {
    ignores: [
      'modelcontextprotocol/**',
      'ai-sdk/**',
      'openai/**',
      'langchain/**',
      'dist/**',
      'build/**',
      'node_modules/**',
      '*.d.ts',
      '*.js',
      '*.mjs',
      'package-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
      'tsconfig.json',
      'jest.config.js',
    ],
  },
  
  // Prettier 통합
  ...compat.extends('plugin:prettier/recommended'),
  
  // 기본 JavaScript 규칙
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
    },

    rules: {
      // 코드 품질
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // 코드 스타일 (Prettier가 처리하므로 제거)
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
    },
  },
  
  // TypeScript 전용 규칙
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ).map(config => ({
    ...config,
    files: ['**/*.ts'],
  })),
  
  {
    files: ['**/*.ts'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    rules: {
      // TypeScript 규칙
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/triple-slash-reference': 0,
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      'prefer-rest-params': 'off',
    },
  },
  
  // 테스트 파일 규칙
  {
    files: ['test/**/*.ts'],

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  
  // 예제 파일 규칙
  {
    files: ['examples/**/*.ts'],

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]; 