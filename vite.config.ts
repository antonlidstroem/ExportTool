import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: 'ExportTool',
  build: {
    chunkSizeWarningLimit: 2500,
  },
})
