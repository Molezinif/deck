import { ExtrudeGeometry, Shape, ShapeGeometry } from 'three'

const ARTWORK_ASPECT = 791 / 1169
export const CARD_HEIGHT = 0.88
export const CARD_WIDTH = CARD_HEIGHT * ARTWORK_ASPECT
export const CARD_THICKNESS = 0.003
const CORNER_RADIUS = 0.035
const CURVE_SEGMENTS = 8

function roundedRectangle(width: number, height: number, radius: number) {
	const x = -width / 2
	const y = -height / 2
	const shape = new Shape()
	shape.moveTo(x + radius, y)
	shape.lineTo(x + width - radius, y)
	shape.quadraticCurveTo(x + width, y, x + width, y + radius)
	shape.lineTo(x + width, y + height - radius)
	shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
	shape.lineTo(x + radius, y + height)
	shape.quadraticCurveTo(x, y + height, x, y + height - radius)
	shape.lineTo(x, y + radius)
	shape.quadraticCurveTo(x, y, x + radius, y)
	return shape
}

const shape = roundedRectangle(CARD_WIDTH, CARD_HEIGHT, CORNER_RADIUS)

export const faceGeometry = new ShapeGeometry(shape, CURVE_SEGMENTS)
const position = faceGeometry.attributes.position
const uv = faceGeometry.attributes.uv
for (let i = 0; i < position.count; i++) {
	uv.setXY(
		i,
		position.getX(i) / CARD_WIDTH + 0.5,
		position.getY(i) / CARD_HEIGHT + 0.5,
	)
}

export const edgeGeometry = new ExtrudeGeometry(shape, {
	depth: CARD_THICKNESS,
	bevelEnabled: false,
	curveSegments: CURVE_SEGMENTS,
})
edgeGeometry.translate(0, 0, -CARD_THICKNESS / 2)
