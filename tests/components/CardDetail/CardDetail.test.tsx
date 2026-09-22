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
const neighbors = { previous: CARDS[21], next: CARDS[23] }

function renderDetail({ onClose = () => {}, onSelect = () => {} } = {}) {
	return render(
		<CardDetail
			card={card}
			{...neighbors}
			onSelect={onSelect}
			onClose={onClose}
		/>,
	)
}

describe('CardDetail', () => {
	it('shows the 3D showcase and the wiki content, labelled by the card name', async () => {
		renderDetail()
		expect(screen.getByRole('dialog', { name: card.name })).toBeTruthy()
		expect((await screen.findByTestId('showcase')).textContent).toBe(card.name)
		expect(screen.getByText(card.meaning)).toBeTruthy()
	})

	it('closes on Escape', () => {
		const onClose = vi.fn()
		renderDetail({ onClose })
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledOnce()
	})

	it('closes on the close button', () => {
		const onClose = vi.fn()
		renderDetail({ onClose })
		fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
		expect(onClose).toHaveBeenCalledOnce()
	})

	it('expands and collapses the showcase', () => {
		renderDetail()
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
		renderDetail({ onClose })
		fireEvent.click(screen.getByRole('button', { name: 'Expandir carta' }))
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).not.toHaveBeenCalled()
		expect(screen.getByRole('button', { name: 'Expandir carta' })).toBeTruthy()
	})

	it('moves to the neighbor cards with the arrows and the keyboard', () => {
		const onSelect = vi.fn()
		renderDetail({ onSelect })
		fireEvent.click(
			screen.getByRole('button', { name: `Próxima carta: ${CARDS[23].name}` }),
		)
		fireEvent.click(
			screen.getByRole('button', { name: `Carta anterior: ${CARDS[21].name}` }),
		)
		fireEvent.keyDown(window, { key: 'ArrowRight' })
		fireEvent.keyDown(window, { key: 'ArrowLeft' })
		expect(onSelect.mock.calls).toEqual([
			[CARDS[23].id],
			[CARDS[21].id],
			[CARDS[23].id],
			[CARDS[21].id],
		])
	})

	it('moves focus into the page and gives it back on close', () => {
		const opener = document.createElement('button')
		document.body.append(opener)
		opener.focus()
		const { unmount } = renderDetail()
		expect(document.activeElement).toBe(
			screen.getByRole('button', { name: 'Fechar' }),
		)
		unmount()
		expect(document.activeElement).toBe(opener)
		opener.remove()
	})
})
