import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['livekit-client', 'livekit-server-sdk'],
  outDir: 'dist',
  target: 'es2020',
  platform: 'neutral', // Works in both Node.js and browser
  splitting: false,
  sourcemap: false,
  minify: false,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs.js' : '.esm.js'
    }
  },
  esbuildOptions(options, context) {
    // Ensure proper handling of dynamic imports
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': '"production"'
    };
  }
});