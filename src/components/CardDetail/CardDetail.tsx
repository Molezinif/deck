import { useState } from 'react'
import type { CardData } from '../../data/cards.ts'
import { useEscapeKey } from '../../useEscapeKey.ts'
import { CardContent } from '../CardContent/CardContent.tsx'
import { CardShowcase } from '../CardShowcase/CardShowcase.tsx'
import './CardDetail.css'

type CardDetailProps = {
	card: CardData
	onClose: () => void
}

export function CardDetail({ card, onClose }: CardDetailProps) {
	const [expanded, setExpanded] = useState(false)
	useEscapeKey(expanded ? () => setExpanded(false) : onClose)

	return (
		<div
			className={expanded ? 'card-detail card-detail--expanded' : 'card-detail'}
			role="dialog"
			aria-modal="true"
			aria-label={card.name}
		>
			<button
				type="button"
				className="card-detail-close"
				onClick={onClose}
				aria-label="Fechar"
			>
				×
			</button>
			<div className="card-detail-showcase">
				<CardShowcase card={card} />
				<button
					type="button"
					className="card-detail-expand"
					onClick={() => setExpanded((current) => !current)}
					aria-pressed={expanded}
				>
					{expanded ? 'Recolher carta' : 'Expandir carta'}
				</button>
			</div>
			<div className="card-detail-body">
				<CardContent card={card} />
			</div>
		</div>
	)
}
