import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  worker: {
    format: "es"
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    }
  },
  build: {
    sourcemap: false,
    assetsDir: "code",
    cssMinify: true,
    target: "esnext",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      output: {
        format: "es",
      },
    }
  },
  plugins: [
    dts({
      rollupTypes: true
    })
  ]
})