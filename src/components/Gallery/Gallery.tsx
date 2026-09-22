import {
	type CSSProperties,
	type PointerEvent,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { type CardData, SUITS, type Suit } from '../../data/cards.ts'
import { feedback } from '../../feedback.ts'
import { m } from '../../paraglide/messages.js'
import { withViewTransition } from '../../viewTransition.ts'
import { Toolbar } from '../Toolbar/Toolbar.tsx'
import './Gallery.css'

const MAX_TILT_DEG = 10
const GITHUB_URL = 'https://github.com/Molezinif/deck'
const COFFEE_URL = 'https://buymeacoffee.com/molezinif'
const CREDITS = [
	{
		role: m.credit_art,
		name: 'Luiddy',
		url: 'https://www.instagram.com/luiddx/',
	},
	{
		role: m.credit_words,
		name: 'Isabelly',
		url: 'https://www.instagram.com/isay.rm/',
	},
	{
		role: m.credit_code,
		name: 'Gabriel',
		url: 'https://www.instagram.com/molezinif/',
	},
]

type View = 'deck' | 'suits'
const VIEWS: { id: View; label: () => string }[] = [
	{ id: 'deck', label: m.view_deck },
	{ id: 'suits', label: m.view_suits },
]
const SUIT_SYMBOLS: Record<Suit, string> = {
	hearts: '♥',
	diamonds: '♦',
	spades: '♠',
	clubs: '♣',
}
const SUIT_TITLES: Record<Suit, () => string> = {
	hearts: m.suit_hearts,
	diamonds: m.suit_diamonds,
	spades: m.suit_spades,
	clubs: m.suit_clubs,
}
const SUIT_ABOUT: Record<Suit, () => string> = {
	hearts: m.suit_hearts_about,
	diamonds: m.suit_diamonds_about,
	spades: m.suit_spades_about,
	clubs: m.suit_clubs_about,
}

type GalleryProps = {
	cards: CardData[]
	activeId: number | null
	inert?: boolean
	onSelect: (id: number) => void
}

const preload = (url: string) => {
	new Image().src = url
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

export function Gallery({ cards, activeId, inert, onSelect }: GalleryProps) {
	const active = useRef<HTMLButtonElement>(null)
	const [view, setView] = useState<View>('deck')
	const [settled, setSettled] = useState(false)

	const switchView = (next: View) => {
		if (next === view) return
		feedback('fan', 0.5)
		withViewTransition(() => {
			setSettled(true)
			setView(next)
		}, 'grid-switching')
	}

	const renderCard = (card: CardData, i: number) => (
		<button
			key={card.id}
			ref={card.id === activeId ? active : undefined}
			type="button"
			className="gallery-item"
			style={{ '--order': i, '--vt-name': `card-${card.id}` } as CSSProperties}
			onClick={() => onSelect(card.id)}
			onPointerEnter={() => preload(card.front)}
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
	)

	useLayoutEffect(() => {
		if (activeId !== null) active.current?.scrollIntoView({ block: 'nearest' })
	}, [activeId])

	return (
		<div
			className={settled ? 'gallery gallery--settled' : 'gallery'}
			inert={inert}
		>
			<div className="gallery-content">
				<header className="gallery-header">
					<fieldset className="gallery-view">
						<legend>{m.view_label()}</legend>
						{VIEWS.map(({ id, label }) => (
							<button
								key={id}
								type="button"
								aria-pressed={view === id}
								onClick={() => switchView(id)}
							>
								{label()}
							</button>
						))}
					</fieldset>
					<Toolbar />
				</header>
				{view === 'deck' ? (
					<div className="gallery-grid">{cards.map(renderCard)}</div>
				) : (
					SUITS.map((suit) => (
						<section
							key={suit}
							className="gallery-suit"
							aria-labelledby={`suit-${suit}`}
						>
							<h2 id={`suit-${suit}`}>
								<span aria-hidden="true">{SUIT_SYMBOLS[suit]}</span>
								{SUIT_TITLES[suit]()}
							</h2>
							{SUIT_ABOUT[suit]() && <p>{SUIT_ABOUT[suit]()}</p>}
							<div className="gallery-grid">
								{cards
									.filter((card) => card.suit === suit)
									.sort((a, b) => a.rank - b.rank)
									.map(renderCard)}
							</div>
						</section>
					))
				)}
			</div>
			<footer className="gallery-footer">
				<p>
					{CREDITS.map((credit, i) => (
						<span key={credit.name}>
							{i > 0 && ' · '}
							{credit.role()}{' '}
							<a href={credit.url} target="_blank" rel="noreferrer">
								{credit.name}
							</a>
						</span>
					))}
				</p>
				<div className="gallery-links">
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						className="gallery-icon"
					>
						<svg viewBox="0 0 16 16" width="18" height="18" role="img">
							<title>GitHub</title>
							<path
								fill="currentColor"
								d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
							/>
						</svg>
					</a>
					<a
						href={COFFEE_URL}
						target="_blank"
						rel="noreferrer"
						className="gallery-icon"
					>
						<svg
							viewBox="0 0 24 24"
							width="19"
							height="19"
							role="img"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Buy Me a Coffee</title>
							<path d="M4 9h12v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
							<path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" />
							<path d="M8 3.5c-.6.8.6 1.7 0 2.5M12 3.5c-.6.8.6 1.7 0 2.5" />
							<path d="M3 21.5h14" />
						</svg>
					</a>
				</div>
			</footer>
		</div>
	)
}
