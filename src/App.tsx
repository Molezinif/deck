import { useState } from 'react'
import { flushSync } from 'react-dom'
import { CardDetail } from './components/CardDetail/CardDetail.tsx'
import { Gallery } from './components/Gallery/Gallery.tsx'
import { CARDS } from './data/cards.ts'
import { withViewTransition } from './viewTransition.ts'

const neighbor = (index: number, step: number) =>
	CARDS[(index + step + CARDS.length) % CARDS.length]

export function App() {
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [returnId, setReturnId] = useState<number | null>(null)
	const index = CARDS.findIndex((card) => card.id === selectedId)

	const open = (id: number) => {
		flushSync(() => setReturnId(id))
		withViewTransition(() => setSelectedId(id))
	}

	const navigate = (id: number) => {
		setReturnId(id)
		setSelectedId(id)
	}

	return (
		<>
			<Gallery
				cards={CARDS}
				activeId={selectedId === null ? returnId : null}
				onSelect={open}
			/>
			{index !== -1 && (
				<CardDetail
					card={CARDS[index]}
					previous={neighbor(index, -1)}
					next={neighbor(index, 1)}
					onSelect={navigate}
					onClose={() => withViewTransition(() => setSelectedId(null))}
				/>
			)}
		</>
	)
}
