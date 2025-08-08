import {FlatCompat} from '@eslint/eslintrc';
import babelParser from '@babel/eslint-parser';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

// Resolve plugins/configs from your project root
const compat = new FlatCompat({baseDirectory: process.cwd()});

export default [
  // 1) Pull in Google’s flat-config wrappers
  ...compat.extends(
    'google',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ),

  // 2) Our overrides
  {
    files: ['**/*.{js,jsx}'], // target all JS files
    ignores: ['node_modules/**'], // ignore deps

    languageOptions: {
      parser: babelParser, // use the imported parser object
      parserOptions: {
        requireConfigFile: false, // no separate babel.config.js needed
        babelOptions: {
          presets: [
            '@babel/preset-env', // ES2020+ syntax
            '@babel/preset-react', // JSX support
          ],
        },
        ecmaVersion: 2020, // modern JS
        sourceType: 'module', // ES modules
      },
    },

    plugins: {
      'react': reactPlugin, // React rules
      'react-hooks': hooksPlugin, // Hooks rules
    },

    settings: {
      'react': {version: 'detect'}, // auto-detect React version
    },

    rules: {
      // allow JSX in .js files
      'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx']}],
      // enforce Rules of Hooks
      'react-hooks/rules-of-hooks': 'error',
      // verify effect dependencies
      'react-hooks/exhaustive-deps': 'warn',
      // disable removed JSDoc rules
      'valid-jsdoc': 'off',
      'require-jsdoc': 'off',
      'linebreak-style': 'off',
      'quote-props': 'off',
      'indent': 'off',
      'brace-style': ['error', '1tbs', {allowSingleLine: true}],
    },
  },
];
