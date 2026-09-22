import type { CardData } from '../../data/cards.ts'
import './CardContent.css'

type CardContentProps = {
	card: CardData
}

export function CardContent({ card }: CardContentProps) {
	const sections = [
		{ title: 'Significado', text: card.meaning },
		{ title: 'Amor', text: card.love },
		{ title: 'Trabalho', text: card.work },
		{ title: 'Saúde', text: card.health },
	]

	return (
		<div className="card-content">
			<p className="card-content-meta">
				{card.id} · {card.playingCard}
			</p>
			<h2>{card.name}</h2>
			<ul className="card-content-keywords">
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
		</div>
	)
}
