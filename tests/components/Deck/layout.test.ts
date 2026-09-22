import { describe, expect, it } from 'vitest'
import { FOCUS_POSE, tablePose } from '../../../src/components/Deck/layout.ts'

const slots = Array.from({ length: 36 }, (_, i) => i)

describe('tablePose', () => {
	it('lays the cards in a centered 9x4 grid', () => {
		const positions = slots.map((slot) => tablePose(slot).position)
		const xs = positions.map(([x]) => x)
		const zs = positions.map(([, , z]) => z)
		expect(new Set(xs.map((x) => x.toFixed(3))).size).toBe(9)
		expect(new Set(zs.map((z) => z.toFixed(3))).size).toBe(4)
		expect(Math.min(...xs)).toBeCloseTo(-Math.max(...xs))
		expect(Math.min(...zs)).toBeCloseTo(-Math.max(...zs))
	})

	it('never puts two cards on the same spot', () => {
		const spots = slots.map((slot) => tablePose(slot).position.join())
		expect(new Set(spots).size).toBe(36)
	})

	it('keeps the cards face up on the table', () => {
		for (const slot of slots) {
			expect(tablePose(slot).position[1]).toBe(0)
			expect(tablePose(slot).rotation).toEqual([Math.PI, 0, 0])
		}
	})
})

describe('FOCUS_POSE', () => {
	it('lifts the card above the table', () => {
		expect(FOCUS_POSE.position[1]).toBeGreaterThan(1)
	})
})
