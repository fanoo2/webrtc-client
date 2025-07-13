import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: ['livekit-client', 'livekit-server-sdk'],
  noExternal: [],
  treeshake: true,
  platform: 'neutral',
  bundle: true,
  skipNodeModulesBundle: true,
  esbuildOptions(options) {
    options.banner = {
      js: '// @fanno/webrtc-client - TypeScript WebRTC client SDK built on LiveKit',
    };
  },
});