import { paraglideVitePlugin } from '@inlang/paraglide-js'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import { cardPages } from './scripts/cardPages.ts'

// Set by the GitHub Pages workflow to "/deck/"; local dev, preview and
// tests keep serving from the root.
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
	base,
	plugins: [
		react(),
		cardPages(`https://molezinif.github.io${base}`),
		VitePWA({
			registerType: 'autoUpdate',
			includeManifestIcons: false,
			manifest: {
				name: 'Baralho Cigano',
				short_name: 'Baralho',
				description:
					'As 36 cartas do baralho cigano, com o significado de cada uma.',
				lang: 'pt-BR',
				start_url: base,
				scope: base,
				display: 'standalone',
				background_color: '#14081f',
				theme_color: '#14081f',
				icons: [
					{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{
						src: 'icons/maskable-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,webp,m4a}'],
				globIgnores: ['*/index.html', 'og/**'],
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
				navigateFallback: `${base}index.html`,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
						handler: 'StaleWhileRevalidate',
						options: { cacheName: 'fonts' },
					},
				],
			},
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/paraglide',
			strategy: ['localStorage', 'baseLocale'],
			emitTsDeclarations: true,
		}),
	],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		// These packages lack an "exports" map, so tests would load their CommonJS builds and a second copy of three
		alias: [
			{
				find: /^@react-three\/fiber$/,
				replacement: '@react-three/fiber/dist/react-three-fiber.esm.js',
			},
			{
				find: /^@react-three\/test-renderer$/,
				replacement:
					'@react-three/test-renderer/dist/react-three-test-renderer.esm.js',
			},
		],
	},
})
