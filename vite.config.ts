import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { version } from './package.json'

const hash = Math.floor(Math.random() * 90000) + 10000;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + version + `.js`,
        chunkFileNames: `[name]` + version + `.js`,
        assetFileNames: `[name]` + version + `.[ext]`
      }
    }
  }
})