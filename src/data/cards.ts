import type { Locale } from '../paraglide/runtime.js'
import english from './cards.en.json'
import entries from './cards.json'

export type CardData = (typeof entries)[number] & {
	id: number
	slug: string
	suit: Suit
	rank: number
	front: string
	thumbnail: string
}

export const SUITS = ['hearts', 'diamonds', 'spades', 'clubs'] as const
export type Suit = (typeof SUITS)[number]

const SUIT_NAMES: Record<string, Suit> = {
	copas: 'hearts',
	ouros: 'diamonds',
	espadas: 'spades',
	paus: 'clubs',
}
const RANKS = ['6', '7', '8', '9', '10', 'valete', 'dama', 'rei', 'ás']

function parsePlayingCard(playingCard: string) {
	const [rank, suit] = playingCard.split(' de ')
	return { suit: SUIT_NAMES[suit], rank: RANKS.indexOf(rank) }
}

const slugify = (name: string) =>
	name
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/\s+/g, '-')

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
		slug: slugify(entry.name),
		...parsePlayingCard(entry.playingCard),
		front: entry.image ? `${cardsPath}/${entry.image}` : placeholder,
		thumbnail: entry.image ? `${cardsPath}/thumbs/${entry.image}` : placeholder,
	}
})

export const CARDS_EN: CardData[] = CARDS.map((card, i) => ({
	...card,
	...english[i],
}))

export const DECKS: Record<Locale, CardData[]> = { pt: CARDS, en: CARDS_EN }
