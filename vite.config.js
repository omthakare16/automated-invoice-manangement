import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-pdf-worker',
      buildStart() {
        const workerPath = resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
        const destPath = resolve(__dirname, 'public/pdf.worker.js')
        fs.copyFileSync(workerPath, destPath)
      }
    }
  ],
  define: {
    'process.env': {}
  }
})
