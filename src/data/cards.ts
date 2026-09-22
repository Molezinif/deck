import entries from './cards.json'

export type CardData = (typeof entries)[number] & { id: number; front: string }

export const CARDS: CardData[] = entries.map((entry, i) => ({
	...entry,
	id: i + 1,
	front: `/cards/${String(i + 1).padStart(2, '0')}.svg`,
}))
