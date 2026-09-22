import { afterEach, describe, expect, it, vi } from 'vitest'
import { haptic } from '../src/feedback.ts'

describe('haptic', () => {
	afterEach(() => {
		Reflect.deleteProperty(navigator, 'vibrate')
	})

	it('vibrates briefly where the Vibration API exists', () => {
		const vibrate = vi.fn()
		Object.defineProperty(navigator, 'vibrate', {
			value: vibrate,
			configurable: true,
		})
		haptic()
		haptic('tick')
		expect(vibrate.mock.calls).toEqual([[10], [4]])
	})
})
