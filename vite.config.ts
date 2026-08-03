import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'prompt',
			includeAssets: ['favicon.ico', 'logo.svg', 'apple-touch-icon-180x180.png'],
			manifest: {
				name: 'DevTools - Utilitários Gratuitos para Desenvolvedores',
				short_name: 'DevTools',
				description: 'Ferramentas gratuitas para desenvolvedores: formatador JSON, gerador de dados, comparador de texto, bcrypt, markdown preview e mais',
				theme_color: '#171717',
				background_color: '#0a0a0a',
				display: 'standalone',
				orientation: 'any',
				icons: [
					{
						src: '/pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					},
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
				// Dynamically imported chunks (mermaid and its diagram renderers, ~3.3 MB)
				// are cached on first use instead of being precached, so installing the
				// PWA does not download the diagram engine for users who never open it.
				globIgnores: ['**/assets/lazy/**'],
				maximumFileSizeToCacheInBytes: 5000000,
				runtimeCaching: [
					{
						urlPattern: /\/assets\/lazy\/.*\.js$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'lazy-chunks-cache',
							expiration: {
								maxEntries: 120,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	],
	build: {
		rollupOptions: {
			output: {
				// Route async chunks into their own folder so the service worker can
				// tell lazy code apart from the initial bundle (see globIgnores above).
				chunkFileNames: 'assets/lazy/[name]-[hash].js',
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	preview: {
		port: 3000,
		host: true,    // This enables listening on all network interfaces
	},
	server: {        // Also add this for development server
		host: true,    // This enables listening on all network interfaces
		port: 3000
	}
});
