import ReactThreeTestRenderer from '@react-three/test-renderer'
import { Mesh, MeshPhysicalMaterial, Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { Card, type Pose } from '../../../src/components/Card/Card.tsx'

vi.mock('@react-three/drei', () => ({ useCursor: () => {} }))

const FRAME = 1 / 60
const RESTING: Pose = { position: [0, 0, 0], rotation: [Math.PI, 0, 0] }
const FOCUSED: Pose = { position: [0, 1, 1], rotation: [Math.PI + 0.35, 0, 0] }
const FACE_DOWN: Pose = { position: [0, 1, 0], rotation: [Math.PI, 0, Math.PI] }

function cardProps(focused: boolean) {
	return {
		front: new Texture(),
		back: new Texture(),
		pose: focused ? FOCUSED : RESTING,
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
			pose={focused ? FOCUSED : RESTING}
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

describe('Card at rest', () => {
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

describe('Card entering', () => {
	it('starts from the given pose and moves into place', async () => {
		const renderer = await ReactThreeTestRenderer.create(
			<Card {...cardProps(false)} from={FACE_DOWN} />,
		)
		const card = renderer.scene.children[0]
		expect(card.instance.rotation.z).toBeCloseTo(Math.PI)
		await renderer.advanceFrames(240, FRAME)
		expect(card.instance.rotation.z).toBeCloseTo(0, 2)
		expect(card.instance.position.y).toBeCloseTo(0, 2)
	})
})

describe('Card feedback', () => {
	const pointer = {
		pointerId: 1,
		target: { setPointerCapture: vi.fn(), releasePointerCapture: vi.fn() },
	}

	async function renderWithFeedback() {
		const onTurn = vi.fn()
		const onSettle = vi.fn()
		const renderer = await ReactThreeTestRenderer.create(
			<Card {...cardProps(true)} onTurn={onTurn} onSettle={onSettle} />,
		)
		return { renderer, card: renderer.scene.children[0], onTurn, onSettle }
	}

	it('ticks each time a face goes past while spinning', async () => {
		const { renderer, card, onTurn } = await renderWithFeedback()
		await renderer.fireEvent(card, 'pointerDown', {
			...pointer,
			clientX: 0,
			clientY: 0,
		})
		for (const x of [100, 200, 300, 400, 500]) {
			await renderer.fireEvent(card, 'pointerMove', {
				clientX: x,
				clientY: 0,
				timeStamp: x,
			})
		}
		expect(onTurn).toHaveBeenCalledTimes(2)
	})

	it('lands with a sound only after being dragged', async () => {
		const { renderer, card, onSettle } = await renderWithFeedback()
		await renderer.fireEvent(card, 'pointerDown', {
			...pointer,
			clientX: 0,
			clientY: 0,
		})
		await renderer.fireEvent(card, 'pointerUp', pointer)
		expect(onSettle).not.toHaveBeenCalled()

		await renderer.fireEvent(card, 'pointerDown', {
			...pointer,
			clientX: 0,
			clientY: 0,
		})
		await renderer.fireEvent(card, 'pointerMove', {
			clientX: 80,
			clientY: 0,
			timeStamp: 1,
		})
		await renderer.fireEvent(card, 'pointerUp', pointer)
		expect(onSettle).toHaveBeenCalledOnce()
	})
})

describe('Card surface', () => {
	it('gives both faces a glossy finish that reflects light', async () => {
		const { card } = await renderCard(false)
		const faces: MeshPhysicalMaterial[] = []
		card.instance.traverse((object) => {
			if (
				object instanceof Mesh &&
				object.material instanceof MeshPhysicalMaterial
			) {
				faces.push(object.material)
			}
		})
		expect(faces).toHaveLength(2)
		for (const face of faces) {
			expect(face.clearcoat).toBeGreaterThan(0)
			expect(face.map).not.toBeNull()
		}
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
		expect(card.instance.rotation.x).toBeCloseTo(FOCUSED.rotation[0] + 0.8, 1)
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

	it('settles on the nearest face when released mid-turn', async () => {
		const { renderer, card, drag, pointer } = await renderCard(true)
		await drag(200, 0)
		await renderer.fireEvent(card, 'pointerUp', pointer)
		await renderer.advanceFrames(240, FRAME)
		expect(card.instance.rotation.z).toBeCloseTo(Math.PI, 2)
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
		expect(card.instance.rotation.x).toBeCloseTo(RESTING.rotation[0], 2)
	})
})
