import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { CardDetail } from './components/CardDetail/CardDetail.tsx'
import { Gallery } from './components/Gallery/Gallery.tsx'
import { Toolbar } from './components/Toolbar/Toolbar.tsx'
import { CARDS, DECKS } from './data/cards.ts'
import { feedback } from './feedback.ts'
import { getLocale } from './paraglide/runtime.js'
import { withViewTransition } from './viewTransition.ts'

const hashOf = (id: number) => `#/${CARDS.find((card) => card.id === id)?.slug}`

const idFromHash = () =>
	CARDS.find((card) => `#/${card.slug}` === location.hash)?.id ?? null

const withoutHash = () => location.pathname + location.search

export function App() {
	const cards = DECKS[getLocale()]
	const [selectedId, setSelectedId] = useState(idFromHash)
	const [returnId, setReturnId] = useState(idFromHash)
	const index = cards.findIndex((card) => card.id === selectedId)

	useEffect(() => {
		const syncWithUrl = () => {
			const id = idFromHash()
			feedback(id === null ? 'settle' : 'flip', id === null ? 0.6 : 1)
			if (id !== null) flushSync(() => setReturnId(id))
			withViewTransition(() => setSelectedId(id))
		}
		window.addEventListener('popstate', syncWithUrl)
		return () => window.removeEventListener('popstate', syncWithUrl)
	}, [])

	const open = (id: number) => {
		feedback('flip')
		flushSync(() => setReturnId(id))
		withViewTransition(() => {
			history.pushState({ opened: true }, '', hashOf(id))
			setSelectedId(id)
		})
	}

	const navigate = (id: number) => {
		feedback('flip', 0.8)
		history.replaceState(history.state, '', hashOf(id))
		setReturnId(id)
		setSelectedId(id)
	}

	// Closing a card opened from the grid goes back in history, so the
	// phone's back gesture and the close button end in the same place.
	const close = () => {
		if (history.state?.opened) {
			history.back()
			return
		}
		feedback('settle', 0.6)
		history.replaceState(null, '', withoutHash())
		withViewTransition(() => setSelectedId(null))
	}

	const neighbor = (step: number) =>
		cards[(index + step + cards.length) % cards.length]

	return (
		<>
			<Toolbar />
			<Gallery
				cards={cards}
				activeId={selectedId === null ? returnId : null}
				inert={index !== -1}
				onSelect={open}
			/>
			{index !== -1 && (
				<CardDetail
					card={cards[index]}
					previous={neighbor(-1)}
					next={neighbor(1)}
					onSelect={navigate}
					onClose={close}
				/>
			)}
		</>
	)
}
