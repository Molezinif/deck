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
const GITHUB_URL = 'https://github.com/Molezinif/deck'
const CREDITS = [
	{ role: 'Arte de', name: 'Luiddy', url: 'https://www.instagram.com/luiddx/' },
	{
		role: 'Textos de',
		name: 'Isabelly',
		url: 'https://www.instagram.com/isay.rm/',
	},
	{
		role: 'Código de',
		name: 'Gabriel',
		url: 'https://www.instagram.com/molezinif/',
	},
]

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
			<footer className="gallery-footer">
				<p>
					{CREDITS.map((credit, i) => (
						<span key={credit.name}>
							{i > 0 && ' · '}
							{credit.role}{' '}
							<a href={credit.url} target="_blank" rel="noreferrer">
								{credit.name}
							</a>
						</span>
					))}
				</p>
				<a
					href={GITHUB_URL}
					target="_blank"
					rel="noreferrer"
					className="gallery-github"
				>
					<svg viewBox="0 0 16 16" width="18" height="18" role="img">
						<title>GitHub</title>
						<path
							fill="currentColor"
							d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
						/>
					</svg>
				</a>
			</footer>
		</div>
	)
}
