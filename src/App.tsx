import { useState } from 'react'
import { flushSync } from 'react-dom'
import { CardDetail } from './components/CardDetail/CardDetail.tsx'
import { Gallery } from './components/Gallery/Gallery.tsx'
import { Toolbar } from './components/Toolbar/Toolbar.tsx'
import { DECKS } from './data/cards.ts'
import { getLocale } from './paraglide/runtime.js'
import { withViewTransition } from './viewTransition.ts'

export function App() {
	const cards = DECKS[getLocale()]
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [returnId, setReturnId] = useState<number | null>(null)
	const index = cards.findIndex((card) => card.id === selectedId)

	const open = (id: number) => {
		flushSync(() => setReturnId(id))
		withViewTransition(() => setSelectedId(id))
	}

	const navigate = (id: number) => {
		setReturnId(id)
		setSelectedId(id)
	}

	const neighbor = (step: number) =>
		cards[(index + step + cards.length) % cards.length]

	return (
		<>
			<Toolbar />
			<Gallery
				cards={cards}
				activeId={selectedId === null ? returnId : null}
				onSelect={open}
			/>
			{index !== -1 && (
				<CardDetail
					card={cards[index]}
					previous={neighbor(-1)}
					next={neighbor(1)}
					onSelect={navigate}
					onClose={() => withViewTransition(() => setSelectedId(null))}
				/>
			)}
		</>
	)
}
