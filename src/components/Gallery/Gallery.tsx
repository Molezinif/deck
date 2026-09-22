import type { CardData } from '../../data/cards.ts'
import './Gallery.css'

type GalleryProps = {
	cards: CardData[]
	onSelect: (id: number) => void
}

export function Gallery({ cards, onSelect }: GalleryProps) {
	return (
		<div className="gallery">
			{cards.map((card) => (
				<button
					key={card.id}
					type="button"
					className="gallery-item"
					onClick={() => onSelect(card.id)}
				>
					<img src={card.front} alt={card.name} loading="lazy" />
					<span>{card.name}</span>
				</button>
			))}
		</div>
	)
}
