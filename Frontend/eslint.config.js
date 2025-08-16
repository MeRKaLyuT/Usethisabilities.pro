import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';


const compat = new FlatCompat({ baseDirectory: process.cwd() });

export default [
  { settings: { react: { version: 'detect' } } },

  js.configs.recommended,

  ...compat.extends('plugin:react/recommended', 'plugin:react-hooks/recommended'),

  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser, 
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ['@babel/preset-env', '@babel/preset-react'] },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: { ...globals.browser }, 
    },
    plugins: { react: reactPlugin, 'react-hooks': hooksPlugin },
    rules: {
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'linebreak-style': 'off',
      'quote-props': 'off',
      'indent': 'off',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], 
    },
  },

  {
    files: ['eslint.config.{js,mjs,cjs}', 'webpack.config.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.node }, 
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'script' },
  },

  { ignores: ['node_modules/**', 'dist/**'] },
];
