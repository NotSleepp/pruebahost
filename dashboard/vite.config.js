import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host',
      remotes: {
        'admin-module': {
          external: 'http://localhost:5001/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        },
        'reports-module': {
          external: 'http://localhost:5004/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        }
      },
      shared: ['vue', 'vue-router']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
        minifyInternalExports: false
      }
    }
  },
  server: {
    port: 5000,
    cors: true,
    strictPort: true
  },
  preview: {
    port: 5000,
    strictPort: true
  }
})
