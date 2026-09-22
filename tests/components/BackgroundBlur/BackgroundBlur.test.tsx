import ReactThreeTestRenderer from '@react-three/test-renderer'
import { type ReactNode, type Ref, useImperativeHandle } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { BackgroundBlur } from '../../../src/components/BackgroundBlur/BackgroundBlur.tsx'

const effect = { bokehScale: 0 }

vi.mock('@react-three/postprocessing', () => ({
	EffectComposer: ({ children }: { children: ReactNode }) => children,
	DepthOfField: ({ ref }: { ref: Ref<typeof effect> }) => {
		useImperativeHandle(ref, () => effect)
		return null
	},
}))

describe('BackgroundBlur', () => {
	it('fades the blur in when active and out when inactive', async () => {
		effect.bokehScale = 0
		const renderer = await ReactThreeTestRenderer.create(
			<BackgroundBlur active focus={[0, 0, 0]} />,
		)
		await renderer.advanceFrames(120, 1 / 60)
		expect(effect.bokehScale).toBeGreaterThan(5)

		await renderer.update(<BackgroundBlur active={false} focus={[0, 0, 0]} />)
		await renderer.advanceFrames(120, 1 / 60)
		expect(effect.bokehScale).toBeLessThan(0.1)
	})

	it('stays sharp while inactive', async () => {
		effect.bokehScale = 0
		const renderer = await ReactThreeTestRenderer.create(
			<BackgroundBlur active={false} focus={[0, 0, 0]} />,
		)
		await renderer.advanceFrames(120, 1 / 60)
		expect(effect.bokehScale).toBe(0)
	})
})
