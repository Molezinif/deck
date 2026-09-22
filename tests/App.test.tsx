import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../src/App.tsx'
import { CARDS } from '../src/data/cards.ts'

vi.mock('../src/components/Gallery/Gallery.tsx', () => ({
	Gallery: ({ onSelect }: { onSelect: (id: number) => void }) => (
		<>
			<button type="button" onClick={() => onSelect(1)}>
				carta 1
			</button>
			<button type="button" onClick={() => onSelect(23)}>
				carta 23
			</button>
		</>
	),
}))

vi.mock('../src/components/CardDetail/CardDetail.tsx', () => ({
	CardDetail: ({
		card,
		onClose,
	}: {
		card: { name: string }
		onClose: () => void
	}) => (
		<div>
			<output>{card.name}</output>
			<button type="button" onClick={onClose}>
				fechar detalhe
			</button>
		</div>
	),
}))

const click = (name: string) =>
	fireEvent.click(screen.getByRole('button', { name }))
const detail = () => screen.queryByRole('status')

describe('App', () => {
	it('starts with no card selected', () => {
		render(<App />)
		expect(detail()).toBeNull()
	})

	it('opens the detail of the tapped card', () => {
		render(<App />)
		click('carta 23')
		expect(detail()?.textContent).toBe(CARDS[22].name)
	})

	it('switches to another card', () => {
		render(<App />)
		click('carta 23')
		click('carta 1')
		expect(detail()?.textContent).toBe(CARDS[0].name)
	})

	it('closes the detail', () => {
		render(<App />)
		click('carta 23')
		click('fechar detalhe')
		expect(detail()).toBeNull()
	})
})
