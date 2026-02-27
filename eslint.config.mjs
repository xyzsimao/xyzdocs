import { nextJsConfig } from 'eslint-config/next-js';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '.next/',
      '.source/',
      'out/',
      'next.config.mjs',
      'postcss.config.js',
    ],
  },
  ...nextJsConfig,
  {
    rules: {
      'no-console': 'off',
      // for xyzdocs CLI
      'import/no-relative-packages': 'off',
    },
  },
];
