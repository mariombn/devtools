import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
		port: 3000,
		host: true,    // This enables listening on all network interfaces
	},
	server: {        // Also add this for development server
		host: true,    // This enables listening on all network interfaces
		port: 3000
	}
})
