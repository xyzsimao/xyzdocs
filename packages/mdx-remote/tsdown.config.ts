import { defineConfig } from 'tsdown'

export default defineConfig({
  external: ['xyzdocs-core', 'next', 'react'],
  dts: true,
  fixedExtension: false,
  target: 'es2023',
  entry: ['./src/index.ts', './src/client/index.ts'],
  format: 'esm',
})
