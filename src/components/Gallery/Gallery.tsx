import { useTexture } from '@react-three/drei'
import {
	type CSSProperties,
	type PointerEvent,
	useLayoutEffect,
	useRef,
} from 'react'
import { BACK_IMAGE, type CardData } from '../../data/cards.ts'
import './Gallery.css'

const MAX_TILT_DEG = 10

type GalleryProps = {
	cards: CardData[]
	activeId: number | null
	onSelect: (id: number) => void
}

function tilt(event: PointerEvent<HTMLElement>) {
	if (event.pointerType === 'touch') return
	const item = event.currentTarget
	const rect = item.getBoundingClientRect()
	const x = (event.clientX - rect.left) / rect.width
	const y = (event.clientY - rect.top) / rect.height
	item.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_TILT_DEG}deg`)
	item.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_TILT_DEG}deg`)
	item.style.setProperty('--mx', `${x * 100}%`)
	item.style.setProperty('--my', `${y * 100}%`)
}

function untilt(event: PointerEvent<HTMLElement>) {
	for (const name of ['--rx', '--ry', '--mx', '--my']) {
		event.currentTarget.style.removeProperty(name)
	}
}

export function Gallery({ cards, activeId, onSelect }: GalleryProps) {
	const active = useRef<HTMLButtonElement>(null)

	useLayoutEffect(() => {
		if (activeId !== null) active.current?.scrollIntoView({ block: 'nearest' })
	}, [activeId])

	return (
		<div className="gallery">
			<div className="gallery-grid">
				{cards.map((card, i) => (
					<button
						key={card.id}
						ref={card.id === activeId ? active : undefined}
						type="button"
						className="gallery-item"
						style={{ '--order': i } as CSSProperties}
						onClick={() => onSelect(card.id)}
						onPointerEnter={() => useTexture.preload([card.front, BACK_IMAGE])}
						onPointerMove={tilt}
						onPointerLeave={untilt}
					>
						<span
							className={
								card.id === activeId
									? 'gallery-card gallery-card--active'
									: 'gallery-card'
							}
						>
							<img
								src={card.thumbnail}
								alt={card.name}
								loading="lazy"
								decoding="async"
							/>
						</span>
						<span className="gallery-label">
							<span className="gallery-number">{card.id}</span>
							{card.name}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}
