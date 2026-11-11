import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Redirect Rollup's native binary to the pure-WASM fallback so Windows
      // Application Control policies cannot block the .node file.
      'rollup/dist/native.js': '@rollup/wasm-node',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
