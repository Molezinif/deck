import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CardWiki } from '../../../src/components/CardWiki/CardWiki.tsx'
import { CARDS } from '../../../src/data/cards.ts'

const card = CARDS[22]

describe('CardWiki', () => {
	it('shows the card identity', () => {
		render(<CardWiki card={card} onClose={() => {}} />)
		expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
			card.name,
		)
		expect(screen.getByText(`${card.id} · ${card.playingCard}`)).toBeTruthy()
	})

	it('lists the keywords', () => {
		render(<CardWiki card={card} onClose={() => {}} />)
		for (const keyword of card.keywords) {
			expect(screen.getByText(keyword)).toBeTruthy()
		}
	})

	it('shows every section', () => {
		render(<CardWiki card={card} onClose={() => {}} />)
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

	it('is labelled by the card name', () => {
		render(<CardWiki card={card} onClose={() => {}} />)
		expect(screen.getByRole('complementary', { name: card.name })).toBeTruthy()
	})

	it('closes on Escape', () => {
		const onClose = vi.fn()
		render(<CardWiki card={card} onClose={onClose} />)
		fireEvent.keyDown(window, { key: 'Enter' })
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledOnce()
	})

	it('stops listening for Escape once closed', () => {
		const onClose = vi.fn()
		const { unmount } = render(<CardWiki card={card} onClose={onClose} />)
		unmount()
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).not.toHaveBeenCalled()
	})

	it('closes on the close button', () => {
		const onClose = vi.fn()
		render(<CardWiki card={card} onClose={onClose} />)
		fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
		expect(onClose).toHaveBeenCalledOnce()
	})
})
