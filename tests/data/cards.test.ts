import { describe, expect, it } from 'vitest'
import { CARDS } from '../../src/data/cards.ts'

const publicImages = Object.keys(
	import.meta.glob(['../../public/cards/*', '../../public/cards/thumbs/*']),
).map((path) => path.replace('../../public', ''))

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

	it('points every card to an image that exists', () => {
		for (const card of CARDS) {
			expect(publicImages).toContain(card.front)
			expect(publicImages).toContain(card.thumbnail)
		}
	})

	it('uses the custom artwork when a card has one', () => {
		expect(CARDS[0].front).toBe('/cards/cavaleiro1.webp')
		expect(CARDS[1].front).toBe('/cards/cavaleiro2.webp')
	})

	it('shows a lighter copy of the custom artwork in the grid', () => {
		expect(CARDS[0].thumbnail).toBe('/cards/thumbs/cavaleiro1.webp')
	})

	it('falls back to the zero padded placeholder', () => {
		expect(CARDS[2].front).toBe('/cards/03.svg')
		expect(CARDS[2].thumbnail).toBe('/cards/03.svg')
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
