import type { CSSProperties } from 'react'
import type { CardData } from '../../data/cards.ts'
import { m } from '../../paraglide/messages.js'
import './CardContent.css'

type CardContentProps = {
	card: CardData
}

const stagger = (order: number) => ({ '--order': order }) as CSSProperties

export function CardContent({ card }: CardContentProps) {
	const sections = [
		{ title: m.section_meaning(), text: card.meaning },
		{ title: m.section_love(), text: card.love },
		{ title: m.section_work(), text: card.work },
		{ title: m.section_health(), text: card.health },
		{ title: m.section_synthesis(), text: card.synthesis.join(' · ') },
	]

	return (
		<div className="card-content">
			<p className="card-content-meta" style={stagger(0)}>
				{card.id} · {card.playingCard}
			</p>
			<h2 style={stagger(1)}>{card.name}</h2>
			<ul className="card-content-keywords" style={stagger(2)}>
				{card.keywords.map((keyword) => (
					<li key={keyword}>{keyword}</li>
				))}
			</ul>
			{sections.map((section, i) => (
				<section key={section.title} style={stagger(i + 3)}>
					<h3>{section.title}</h3>
					<p>{section.text}</p>
				</section>
			))}
		</div>
	)
}
