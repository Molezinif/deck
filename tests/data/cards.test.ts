import { describe, expect, it } from 'vitest'
import { CARDS } from '../../src/data/cards.ts'

const publicImages = Object.keys(import.meta.glob('../../public/cards/*')).map(
	(path) => path.replace('../../public', ''),
)

describe('CARDS', () => {
	it('has the 36 cards of the cigano deck', () => {
		expect(CARDS).toHaveLength(36)
	})

	it('numbers cards sequentially from 1', () => {
		expect(CARDS.map((card) => card.id)).toEqual(
			Array.from({ length: 36 }, (_, i) => i + 1),
		)
	})

	it('keeps the traditional order', () => {
		expect(CARDS[0].name).toBe('Cavaleiro')
		expect(CARDS[27].name).toBe('Cigano')
		expect(CARDS[28].name).toBe('Cigana')
		expect(CARDS[35].name).toBe('Cruz')
	})

	it('has unique names', () => {
		expect(new Set(CARDS.map((card) => card.name)).size).toBe(36)
	})

	it('points each card to a zero padded front image that exists', () => {
		for (const card of CARDS) {
			expect(card.front).toBe(`/cards/${String(card.id).padStart(2, '0')}.svg`)
			expect(publicImages).toContain(card.front)
		}
	})

	it('fills every wiki field', () => {
		for (const card of CARDS) {
			expect(card.playingCard).not.toBe('')
			expect(card.meaning).not.toBe('')
			expect(card.love).not.toBe('')
			expect(card.work).not.toBe('')
			expect(card.health).not.toBe('')
			expect(card.keywords.length).toBeGreaterThan(0)
			expect(card.synthesis.length).toBeGreaterThan(0)
		}
	})

	it('maps each card to a different playing card', () => {
		expect(new Set(CARDS.map((card) => card.playingCard)).size).toBe(36)
	})
})
