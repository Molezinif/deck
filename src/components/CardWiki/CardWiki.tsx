import { useEffect } from 'react'
import type { CardData } from '../../data/cards.ts'
import './CardWiki.css'

type CardWikiProps = {
	card: CardData
	onClose: () => void
}

export function CardWiki({ card, onClose }: CardWikiProps) {
	useEffect(() => {
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', closeOnEscape)
		return () => window.removeEventListener('keydown', closeOnEscape)
	}, [onClose])

	const sections = [
		{ title: 'Significado', text: card.meaning },
		{ title: 'Amor', text: card.love },
		{ title: 'Trabalho', text: card.work },
		{ title: 'Saúde', text: card.health },
	]

	return (
		<aside className="card-wiki" aria-labelledby="card-wiki-title">
			<button
				type="button"
				className="card-wiki-close"
				onClick={onClose}
				aria-label="Fechar"
			>
				×
			</button>
			<p className="card-wiki-meta">
				{card.id} · {card.playingCard}
			</p>
			<h2 id="card-wiki-title">{card.name}</h2>
			<ul className="card-wiki-keywords">
				{card.keywords.map((keyword) => (
					<li key={keyword}>{keyword}</li>
				))}
			</ul>
			{sections.map((section) => (
				<section key={section.title}>
					<h3>{section.title}</h3>
					<p>{section.text}</p>
				</section>
			))}
			<section>
				<h3>Síntese</h3>
				<p>{card.synthesis.join(' · ')}</p>
			</section>
		</aside>
	)
}
