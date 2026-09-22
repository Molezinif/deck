import { useState } from 'react'
import { CardDetail } from './components/CardDetail/CardDetail.tsx'
import { Gallery } from './components/Gallery/Gallery.tsx'
import { CARDS } from './data/cards.ts'

export function App() {
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const selected = CARDS.find((card) => card.id === selectedId)

	return (
		<>
			<Gallery cards={CARDS} onSelect={setSelectedId} />
			{selected && (
				<CardDetail card={selected} onClose={() => setSelectedId(null)} />
			)}
		</>
	)
}
