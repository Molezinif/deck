import entries from './cards.json'

export type CardData = (typeof entries)[number] & {
	id: number
	front: string
	thumbnail: string
}

// import.meta.env.BASE_URL always ends in "/"; prefixing with it keeps
// these public/ paths correct whether the app is served at the domain
// root or under a subpath, like a GitHub Pages project site.
const cardsPath = `${import.meta.env.BASE_URL}cards`

export const BACK_IMAGE = `${cardsPath}/back.svg`

export const CARDS: CardData[] = entries.map((entry, i) => {
	const placeholder = `${cardsPath}/${String(i + 1).padStart(2, '0')}.svg`
	return {
		...entry,
		id: i + 1,
		front: entry.image ? `${cardsPath}/${entry.image}` : placeholder,
		thumbnail: entry.image ? `${cardsPath}/thumbs/${entry.image}` : placeholder,
	}
})
