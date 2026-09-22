import ReactThreeTestRenderer from '@react-three/test-renderer'
import { Mesh, MeshBasicMaterial, Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { Card } from '../../../src/components/Deck/Card.tsx'
import { FOCUS_POSE, tablePose } from '../../../src/components/Deck/layout.ts'

vi.mock('@react-three/drei', () => ({ useCursor: () => {} }))

const FRAME = 1 / 60

function cardProps(focused: boolean) {
	return {
		front: new Texture(),
		back: new Texture(),
		pose: focused ? FOCUS_POSE : tablePose(0),
		focused,
		onSelect: () => {},
	}
}

async function renderCard(focused: boolean) {
	const onSelect = vi.fn()
	const pointer = {
		pointerId: 1,
		target: { setPointerCapture: vi.fn(), releasePointerCapture: vi.fn() },
	}
	const renderer = await ReactThreeTestRenderer.create(
		<Card
			front={new Texture()}
			back={new Texture()}
			pose={focused ? FOCUS_POSE : tablePose(0)}
			focused={focused}
			onSelect={onSelect}
		/>,
	)
	const card = renderer.scene.children[0]
	const drag = async (deltaX: number, deltaY: number) => {
		await renderer.fireEvent(card, 'pointerDown', {
			...pointer,
			clientX: 100,
			clientY: 100,
		})
		await renderer.fireEvent(card, 'pointerMove', {
			clientX: 100 + deltaX,
			clientY: 100 + deltaY,
		})
	}
	const unfocus = () => renderer.update(<Card {...cardProps(false)} />)
	return { renderer, card, onSelect, drag, unfocus, pointer }
}

function sheenOf(card: { instance: Mesh['parent'] }) {
	let material = new MeshBasicMaterial()
	card.instance?.traverse((object) => {
		if (
			object instanceof Mesh &&
			object.material instanceof MeshBasicMaterial
		) {
			material = object.material
		}
	})
	return material
}

describe('Card on the table', () => {
	it('asks to be selected when clicked', async () => {
		const { renderer, card, onSelect } = await renderCard(false)
		await renderer.fireEvent(card, 'click')
		expect(onSelect).toHaveBeenCalledOnce()
	})

	it('lifts while hovered and settles back after', async () => {
		const { renderer, card } = await renderCard(false)
		await renderer.fireEvent(card, 'pointerOver')
		await renderer.advanceFrames(60, FRAME)
		expect(card.instance.position.y).toBeGreaterThan(0.03)

		await renderer.fireEvent(card, 'pointerOut')
		await renderer.advanceFrames(60, FRAME)
		expect(card.instance.position.y).toBeLessThan(0.001)
	})

	it('cannot be spun', async () => {
		const { renderer, card, drag, pointer } = await renderCard(false)
		await drag(100, 0)
		await renderer.advanceFrames(60, FRAME)
		expect(card.instance.rotation.z).toBe(0)
		expect(pointer.target.setPointerCapture).not.toHaveBeenCalled()
	})
})

describe('Focused card', () => {
	it('ignores clicks so it can be dragged', async () => {
		const { renderer, card, onSelect } = await renderCard(true)
		await renderer.fireEvent(card, 'click')
		expect(onSelect).not.toHaveBeenCalled()
	})

	it('spins while dragged sideways', async () => {
		const { renderer, card, drag, pointer } = await renderCard(true)
		await drag(100, 0)
		await renderer.advanceFrames(60, FRAME)
		expect(card.instance.rotation.z).toBeCloseTo(1, 1)
		expect(pointer.target.setPointerCapture).toHaveBeenCalledWith(1)
	})

	it('follows each step of a long drag', async () => {
		const { renderer, card, pointer } = await renderCard(true)
		await renderer.fireEvent(card, 'pointerDown', {
			...pointer,
			clientX: 0,
			clientY: 0,
		})
		await renderer.fireEvent(card, 'pointerMove', { clientX: 100, clientY: 0 })
		await renderer.fireEvent(card, 'pointerMove', { clientX: 150, clientY: 0 })
		await renderer.advanceFrames(120, FRAME)
		expect(card.instance.rotation.z).toBeCloseTo(1.5, 1)
	})

	it('limits the tilt while dragged vertically', async () => {
		const { renderer, card, drag } = await renderCard(true)
		await drag(0, 1000)
		await renderer.advanceFrames(120, FRAME)
		expect(card.instance.rotation.x).toBeCloseTo(
			FOCUS_POSE.rotation[0] + 0.8,
			1,
		)
	})

	it('stops following the pointer once released', async () => {
		const { renderer, card, pointer } = await renderCard(true)
		await renderer.fireEvent(card, 'pointerDown', {
			...pointer,
			clientX: 0,
			clientY: 0,
		})
		await renderer.fireEvent(card, 'pointerUp', pointer)
		await renderer.fireEvent(card, 'pointerMove', { clientX: 100, clientY: 0 })
		await renderer.advanceFrames(60, FRAME)
		expect(card.instance.rotation.z).toBeCloseTo(0)
		expect(pointer.target.releasePointerCapture).toHaveBeenCalledWith(1)
	})

	it('shines only while turning', async () => {
		const { renderer, card, drag } = await renderCard(true)
		const sheen = sheenOf(card)
		await renderer.advanceFrames(240, FRAME)
		expect(sheen.opacity).toBeLessThan(0.05)

		await drag(300, 0)
		await renderer.advanceFrames(5, FRAME)
		expect(sheen.opacity).toBeGreaterThan(0.2)

		await renderer.advanceFrames(240, FRAME)
		expect(sheen.opacity).toBeLessThan(0.05)
	})

	it('unwinds its spin the short way when it leaves the focus', async () => {
		const { renderer, card, drag, unfocus } = await renderCard(true)
		await drag(700, 0)
		await renderer.advanceFrames(120, FRAME)
		await unfocus()
		await renderer.advanceFrames(1, FRAME)
		expect(Math.abs(card.instance.rotation.z)).toBeLessThanOrEqual(Math.PI)

		await renderer.advanceFrames(240, FRAME)
		expect(Math.abs(card.instance.rotation.z)).toBeLessThan(0.01)
	})

	it('lies flat again after being only tilted', async () => {
		const { renderer, card, drag, unfocus } = await renderCard(true)
		await drag(0, 50)
		await renderer.advanceFrames(120, FRAME)
		await unfocus()
		await renderer.advanceFrames(240, FRAME)
		expect(card.instance.rotation.x).toBeCloseTo(tablePose(0).rotation[0], 2)
	})

	it('survives a frame with no elapsed time', async () => {
		const { renderer, card, drag } = await renderCard(true)
		await drag(100, 0)
		await renderer.advanceFrames(1, 0)
		await renderer.advanceFrames(60, FRAME)
		expect(sheenOf(card).opacity).not.toBeNaN()
		expect(card.instance.rotation.z).not.toBeNaN()
	})
})
