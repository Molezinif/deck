import { CARD_HEIGHT, CARD_WIDTH } from './geometry.ts'

const TABLE_COLUMNS = 9
const TABLE_ROWS = 4
const TABLE_GAP = 0.08

export type Pose = {
	position: [number, number, number]
	rotation: [number, number, number]
}

export const FOCUS_POSE: Pose = {
	position: [-0.45, 3.9, 1.45],
	rotation: [Math.PI + 0.35, 0, 0],
}

export function tablePose(slot: number): Pose {
	const column = slot % TABLE_COLUMNS
	const row = Math.floor(slot / TABLE_COLUMNS)
	return {
		position: [
			(column - (TABLE_COLUMNS - 1) / 2) * (CARD_WIDTH + TABLE_GAP),
			0,
			(row - (TABLE_ROWS - 1) / 2) * (CARD_HEIGHT + TABLE_GAP),
		],
		rotation: [Math.PI, 0, 0],
	}
}
