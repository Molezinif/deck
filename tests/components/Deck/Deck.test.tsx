import ReactThreeTestRenderer from '@react-three/test-renderer'
import { Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { Deck } from '../../../src/components/Deck/Deck.tsx'
import { FOCUS_POSE, tablePose } from '../../../src/components/Deck/layout.ts'
import { CARDS } from '../../../src/data/cards.ts'

vi.mock('@react-three/drei', () => ({
	useCursor: () => {},
	useTexture: (urls: string[]) => urls.map(() => new Texture()),
}))

async function renderDeck(selectedId: number | null = null) {
	const onSelect = vi.fn()
	const renderer = await ReactThreeTestRenderer.create(
		<Deck
			cards={CARDS}
			back="/cards/back.svg"
			selectedId={selectedId}
			onSelect={onSelect}
		/>,
	)
	return { renderer, cards: renderer.scene.children[0].children, onSelect }
}

describe('Deck', () => {
	it('places every card on its table spot', async () => {
		const { cards } = await renderDeck()
		expect(cards).toHaveLength(36)
		cards.forEach((card, i) => {
			expect(card.instance.position.toArray()).toEqual(tablePose(i).position)
		})
	})

	it('reports the id of the clicked card', async () => {
		const { renderer, cards, onSelect } = await renderDeck()
		await renderer.fireEvent(cards[4], 'click')
		expect(onSelect).toHaveBeenCalledWith(5)
	})

	it('sends only the selected card to the focus spot', async () => {
		const { renderer, cards } = await renderDeck(5)
		await renderer.advanceFrames(60, 1 / 60)
		const [x, y, z] = FOCUS_POSE.position
		expect(cards[4].instance.position.x).toBeCloseTo(x, 1)
		expect(cards[4].instance.position.y).toBeCloseTo(y, 1)
		expect(cards[4].instance.position.z).toBeCloseTo(z, 1)
		expect(cards[3].instance.position.toArray()).toEqual(tablePose(3).position)
	})
})
