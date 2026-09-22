import { useTexture } from '@react-three/drei'
import type { CardData } from '../../data/cards.ts'
import { Card } from './Card.tsx'
import { FOCUS_POSE, tablePose } from './layout.ts'

type DeckProps = {
	cards: CardData[]
	back: string
	selectedId: number | null
	onSelect: (id: number) => void
}

export function Deck({ cards, back, selectedId, onSelect }: DeckProps) {
	const [backMap, ...frontMaps] = useTexture([
		back,
		...cards.map((card) => card.front),
	])

	return (
		<group>
			{cards.map((card, i) => (
				<Card
					key={card.id}
					front={frontMaps[i]}
					back={backMap}
					focused={card.id === selectedId}
					pose={card.id === selectedId ? FOCUS_POSE : tablePose(i)}
					onSelect={() => onSelect(card.id)}
				/>
			))}
		</group>
	)
}
