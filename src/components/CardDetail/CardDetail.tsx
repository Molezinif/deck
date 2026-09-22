import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CardData } from '../../data/cards.ts'
import { m } from '../../paraglide/messages.js'
import { useKeyDown } from '../../useKeyDown.ts'
import { CardContent } from '../CardContent/CardContent.tsx'
import { Toolbar } from '../Toolbar/Toolbar.tsx'
import './CardDetail.css'

const CardShowcase = lazy(() =>
	import('../CardShowcase/CardShowcase.tsx').then((module) => ({
		default: module.CardShowcase,
	})),
)

type CardDetailProps = {
	card: CardData
	previous: CardData
	next: CardData
	onSelect: (id: number) => void
	onClose: () => void
}

export function CardDetail({
	card,
	previous,
	next,
	onSelect,
	onClose,
}: CardDetailProps) {
	const [expanded, setExpanded] = useState(false)
	const [direction, setDirection] = useState<1 | -1>(1)
	const slot = useRef<HTMLDivElement>(null)
	const closeButton = useRef<HTMLButtonElement>(null)
	const [opener] = useState(() => document.activeElement)

	useEffect(() => {
		closeButton.current?.focus({ preventScroll: true })
		return () => {
			if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
		}
	}, [opener])

	const go = (target: CardData, step: 1 | -1) => {
		setDirection(step)
		onSelect(target.id)
	}
	const goPrevious = () => go(previous, -1)
	const goNext = () => go(next, 1)

	useKeyDown({
		Escape: expanded ? () => setExpanded(false) : onClose,
		ArrowLeft: goPrevious,
		ArrowRight: goNext,
	})

	return (
		<div
			className={expanded ? 'card-detail card-detail--expanded' : 'card-detail'}
			role="dialog"
			aria-modal="true"
			aria-label={card.name}
		>
			<div className="card-detail-canvas">
				<Suspense fallback={null}>
					<CardShowcase
						card={card}
						direction={direction}
						upcoming={[previous.front, next.front]}
						slot={slot}
					/>
				</Suspense>
			</div>
			<button
				type="button"
				ref={closeButton}
				className="card-detail-button card-detail-close"
				onClick={onClose}
				aria-label={m.close()}
			>
				×
			</button>
			<div className="card-detail-toolbar">
				<Toolbar />
			</div>
			<div className="card-detail-layout">
				<div className="card-detail-stage">
					<div ref={slot} className="card-detail-slot" />
					<div className="card-detail-controls">
						<button
							type="button"
							className="card-detail-button"
							onClick={goPrevious}
							aria-label={m.previous_card({ name: previous.name })}
						>
							‹
						</button>
						<button
							type="button"
							className="card-detail-expand"
							onClick={() => setExpanded((current) => !current)}
							aria-pressed={expanded}
						>
							{expanded ? m.collapse_card() : m.expand_card()}
						</button>
						<button
							type="button"
							className="card-detail-button"
							onClick={goNext}
							aria-label={m.next_card({ name: next.name })}
						>
							›
						</button>
					</div>
				</div>
				<div className="card-detail-body">
					<CardContent key={card.id} card={card} />
				</div>
			</div>
		</div>
	)
}
