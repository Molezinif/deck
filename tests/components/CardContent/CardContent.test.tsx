import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardContent } from '../../../src/components/CardContent/CardContent.tsx'
import { CARDS } from '../../../src/data/cards.ts'

const card = CARDS[22]

describe('CardContent', () => {
	it('shows the card identity', () => {
		render(<CardContent card={card} />)
		expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
			card.name,
		)
		expect(screen.getByText(`${card.id} · ${card.playingCard}`)).toBeTruthy()
	})

	it('lists the keywords', () => {
		render(<CardContent card={card} />)
		for (const keyword of card.keywords) {
			expect(screen.getByText(keyword)).toBeTruthy()
		}
	})

	it('shows every section', () => {
		render(<CardContent card={card} />)
		const headings = screen
			.getAllByRole('heading', { level: 3 })
			.map((heading) => heading.textContent)
		expect(headings).toEqual([
			'Significado',
			'Amor',
			'Trabalho',
			'Saúde',
			'Síntese',
		])
		expect(screen.getByText(card.meaning)).toBeTruthy()
		expect(screen.getByText(card.love)).toBeTruthy()
		expect(screen.getByText(card.work)).toBeTruthy()
		expect(screen.getByText(card.health)).toBeTruthy()
		expect(screen.getByText(card.synthesis.join(' · '))).toBeTruthy()
	})
})
