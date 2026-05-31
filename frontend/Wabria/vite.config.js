import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base — built site opens correctly from file:// or any host.
export default defineConfig({
  plugins: [react()],
  base: './',
})
