import ReactThreeTestRenderer from '@react-three/test-renderer'
import type { ReactNode } from 'react'
import { type Group, Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { CardShowcaseScene } from '../../../src/components/CardShowcase/CardShowcase.tsx'
import { BACK_IMAGE, CARDS } from '../../../src/data/cards.ts'

const { useTexture } = vi.hoisted(() => ({
	useTexture: Object.assign(
		vi.fn((urls: string[]) => urls.map(() => new Texture())),
		{ preload: vi.fn() },
	),
}))

vi.mock('@react-three/drei', () => ({
	useCursor: () => {},
	useTexture,
	Environment: () => null,
	Lightformer: () => null,
	Sparkles: () => null,
	ContactShadows: () => null,
	Float: ({ children }: { children: ReactNode }) => <group>{children}</group>,
}))

const FRAME = 1 / 60
const card = CARDS[22]
const props = {
	card,
	direction: 1 as const,
	upcoming: [CARDS[21].front, CARDS[23].front],
	slot: { current: null },
}

async function renderShowcase() {
	const renderer = await ReactThreeTestRenderer.create(
		<CardShowcaseScene {...props} />,
	)
	type Node = (typeof renderer.scene.allChildren)[number]
	const findCard = (nodes: Node[]): Group | undefined => {
		for (const node of nodes) {
			if (node.props.onPointerDown) return node.instance as Group
			const found = findCard(node.allChildren)
			if (found) return found
		}
	}
	const cardGroup = findCard(renderer.scene.allChildren)
	if (!cardGroup) throw new Error('card not found')
	return { renderer, cardGroup }
}

describe('CardShowcase', () => {
	it('loads the front artwork and the shared back', async () => {
		await renderShowcase()
		expect(useTexture).toHaveBeenCalledWith([card.front, BACK_IMAGE])
	})

	it('preloads the neighbor cards', async () => {
		await renderShowcase()
		expect(useTexture.preload).toHaveBeenCalledWith([
			CARDS[21].front,
			BACK_IMAGE,
		])
		expect(useTexture.preload).toHaveBeenCalledWith([
			CARDS[23].front,
			BACK_IMAGE,
		])
	})

	it('arrives face down and turns over to face the camera', async () => {
		const { renderer, cardGroup } = await renderShowcase()
		expect(cardGroup.rotation.z).toBeCloseTo(Math.PI)

		await renderer.advanceFrames(240, FRAME)
		expect(cardGroup.position.z).toBeCloseTo(0, 2)
		expect(cardGroup.rotation.x).toBeCloseTo(-Math.PI / 2, 2)
		expect(cardGroup.rotation.z).toBeCloseTo(0, 2)
	})
})
