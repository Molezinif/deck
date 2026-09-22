import { CARDS } from './data/cards.ts'

const BASE = import.meta.env.BASE_URL

export const homePath = () => BASE

export const cardPath = (id: number) =>
	`${BASE}${CARDS.find((card) => card.id === id)?.slug}/`

export function cardIdFromLocation() {
	const slug = location.pathname.slice(BASE.length).replace(/\/$/, '')
	return CARDS.find((card) => card.slug === slug)?.id ?? null
}

// Card addresses used to live in the hash (#/cavaleiro); links shared back
// then still land on the right card.
export function upgradeLegacyHash() {
	const slug = location.hash.match(/^#\/(.+)$/)?.[1]
	const card = CARDS.find((candidate) => candidate.slug === slug)
	if (card) history.replaceState(null, '', cardPath(card.id))
}
