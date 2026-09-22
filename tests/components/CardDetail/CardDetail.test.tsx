import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CardDetail } from '../../../src/components/CardDetail/CardDetail.tsx'
import { CARDS } from '../../../src/data/cards.ts'

vi.mock('../../../src/components/CardShowcase/CardShowcase.tsx', () => ({
	CardShowcase: ({ card }: { card: { name: string } }) => (
		<div data-testid="showcase">{card.name}</div>
	),
}))

const card = CARDS[22]

describe('CardDetail', () => {
	it('shows the 3D showcase and the wiki content, labelled by the card name', () => {
		render(<CardDetail card={card} onClose={() => {}} />)
		expect(screen.getByRole('dialog', { name: card.name })).toBeTruthy()
		expect(screen.getByTestId('showcase').textContent).toBe(card.name)
		expect(screen.getByText(card.meaning)).toBeTruthy()
	})

	it('closes on Escape', () => {
		const onClose = vi.fn()
		render(<CardDetail card={card} onClose={onClose} />)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledOnce()
	})

	it('closes on the close button', () => {
		const onClose = vi.fn()
		render(<CardDetail card={card} onClose={onClose} />)
		fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
		expect(onClose).toHaveBeenCalledOnce()
	})

	it('expands and collapses the showcase', () => {
		render(<CardDetail card={card} onClose={() => {}} />)
		const toggle = screen.getByRole('button', { name: 'Expandir carta' })
		expect(toggle.getAttribute('aria-pressed')).toBe('false')

		fireEvent.click(toggle)
		const collapse = screen.getByRole('button', { name: 'Recolher carta' })
		expect(collapse.getAttribute('aria-pressed')).toBe('true')

		fireEvent.click(collapse)
		expect(
			screen
				.getByRole('button', { name: 'Expandir carta' })
				.getAttribute('aria-pressed'),
		).toBe('false')
	})

	it('collapses on Escape instead of closing when expanded', () => {
		const onClose = vi.fn()
		render(<CardDetail card={card} onClose={onClose} />)
		fireEvent.click(screen.getByRole('button', { name: 'Expandir carta' }))
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).not.toHaveBeenCalled()
		expect(screen.getByRole('button', { name: 'Expandir carta' })).toBeTruthy()
	})
})
