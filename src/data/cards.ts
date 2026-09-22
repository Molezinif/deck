import entries from './cards.json'

export type CardData = (typeof entries)[number] & { id: number; front: string }

// import.meta.env.BASE_URL always ends in "/"; prefixing with it keeps
// these public/ paths correct whether the app is served at the domain
// root or under a subpath, like a GitHub Pages project site.
const cardsPath = `${import.meta.env.BASE_URL}cards`

export const BACK_IMAGE = `${cardsPath}/back.svg`

export const CARDS: CardData[] = entries.map((entry, i) => ({
	...entry,
	id: i + 1,
	front: `${cardsPath}/${entry.image ?? `${String(i + 1).padStart(2, '0')}.svg`}`,
}))
