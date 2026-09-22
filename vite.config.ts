import { paraglideVitePlugin } from '@inlang/paraglide-js'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	// Set by the GitHub Pages workflow to "/deck/"; local dev, preview and
	// tests keep serving from the root.
	base: process.env.VITE_BASE_PATH ?? '/',
	plugins: [
		react(),
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
