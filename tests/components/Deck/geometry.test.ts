import { describe, expect, it } from 'vitest'
import {
	CARD_HEIGHT,
	CARD_THICKNESS,
	CARD_WIDTH,
	edgeGeometry,
	faceGeometry,
	sheenTexture,
} from '../../../src/components/Deck/geometry.ts'

describe('faceGeometry', () => {
	it('spans the card size centered on the origin', () => {
		faceGeometry.computeBoundingBox()
		const box = faceGeometry.boundingBox
		expect(box?.min.x).toBeCloseTo(-CARD_WIDTH / 2)
		expect(box?.max.x).toBeCloseTo(CARD_WIDTH / 2)
		expect(box?.min.y).toBeCloseTo(-CARD_HEIGHT / 2)
		expect(box?.max.y).toBeCloseTo(CARD_HEIGHT / 2)
	})

	it('maps the whole image onto the card', () => {
		const uv = faceGeometry.attributes.uv
		const us = Array.from({ length: uv.count }, (_, i) => uv.getX(i))
		const vs = Array.from({ length: uv.count }, (_, i) => uv.getY(i))
		expect(Math.min(...us)).toBeCloseTo(0)
		expect(Math.max(...us)).toBeCloseTo(1)
		expect(Math.min(...vs)).toBeCloseTo(0)
		expect(Math.max(...vs)).toBeCloseTo(1)
	})

	it('rounds the corners', () => {
		const position = faceGeometry.attributes.position
		for (let i = 0; i < position.count; i++) {
			const atCornerX = Math.abs(Math.abs(position.getX(i)) - CARD_WIDTH / 2)
			const atCornerY = Math.abs(Math.abs(position.getY(i)) - CARD_HEIGHT / 2)
			expect(atCornerX < 1e-6 && atCornerY < 1e-6).toBe(false)
		}
	})
})

describe('edgeGeometry', () => {
	it('has the card thickness centered on the face plane', () => {
		edgeGeometry.computeBoundingBox()
		const box = edgeGeometry.boundingBox
		expect(box?.min.z).toBeCloseTo(-CARD_THICKNESS / 2)
		expect(box?.max.z).toBeCloseTo(CARD_THICKNESS / 2)
	})
})

describe('sheenTexture', () => {
	it('is a canvas texture', () => {
		expect(sheenTexture.image).toBeInstanceOf(HTMLCanvasElement)
	})
})
