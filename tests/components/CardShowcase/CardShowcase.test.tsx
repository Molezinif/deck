import ReactThreeTestRenderer from '@react-three/test-renderer'
import { Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { CardShowcaseScene } from '../../../src/components/CardShowcase/CardShowcase.tsx'
import { CARDS } from '../../../src/data/cards.ts'

const useTexture = vi.fn((urls: string[]) => urls.map(() => new Texture()))

vi.mock('@react-three/drei', () => ({
	useCursor: () => {},
	useTexture: (urls: string[]) => useTexture(urls),
	Environment: () => null,
	Lightformer: () => null,
}))

const card = CARDS[22]

describe('CardShowcase', () => {
	it('loads the front artwork and the shared back', async () => {
		await ReactThreeTestRenderer.create(<CardShowcaseScene card={card} />)
		expect(useTexture).toHaveBeenCalledWith([card.front, '/cards/back.svg'])
	})

	it('rests facing the camera, not lying flat like on the table', async () => {
		const renderer = await ReactThreeTestRenderer.create(
			<CardShowcaseScene card={card} />,
		)
		const group = renderer.scene.children.find(
			(child) => child.type === 'Group',
		)
		expect(group?.instance.position.toArray()).toEqual([0, 0, 0])
		expect(group?.instance.rotation.toArray().slice(0, 3)).toEqual([
			-Math.PI / 2,
			0,
			0,
		])
	})
})
