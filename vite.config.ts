import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
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
