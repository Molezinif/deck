import { useState } from 'react'
import { CardWiki } from './components/CardWiki/CardWiki.tsx'
import { Table } from './components/Table/Table.tsx'
import { CARDS } from './data/cards.ts'

export function App() {
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const selected = CARDS.find((card) => card.id === selectedId)

	return (
		<>
			<Table
				cards={CARDS}
				selectedId={selectedId}
				onSelect={(id) =>
					setSelectedId((current) => (current === id ? null : id))
				}
				onDismiss={() => setSelectedId(null)}
			/>
			{selected && (
				<CardWiki card={selected} onClose={() => setSelectedId(null)} />
			)}
		</>
	)
}
