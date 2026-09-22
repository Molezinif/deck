import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../src/App.tsx'
import { CARDS, CARDS_EN } from '../src/data/cards.ts'
import { localStorageKey } from '../src/paraglide/runtime.js'

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

	it('closes the detail', async () => {
		render(<App />)
		click('carta 23')
		click('fechar detalhe')
		await waitFor(() => expect(detail()).toBeNull())
		expect(location.hash).toBe('')
	})

	it('gives each open card its own address', () => {
		render(<App />)
		click('carta 23')
		expect(location.hash).toBe('#/rato')
	})

	it('opens the card in the address', () => {
		history.replaceState(null, '', '/#/coracao')
		render(<App />)
		expect(detail()?.textContent).toBe('Coração')
	})

	it('closes the card when going back', async () => {
		render(<App />)
		click('carta 1')
		act(() => history.back())
		await waitFor(() => expect(detail()).toBeNull())
	})

	it('closes a card opened from a link without leaving the site', () => {
		history.replaceState(null, '', '/#/coracao')
		render(<App />)
		click('fechar detalhe')
		expect(detail()).toBeNull()
		expect(location.hash).toBe('')
	})

	it('defaults to Portuguese whatever the browser language', () => {
		localStorage.clear()
		vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
		render(<App />)
		click('carta 23')
		expect(detail()?.textContent).toBe(CARDS[22].name)
	})

	it('shows the English deck when the locale is English', () => {
		localStorage.setItem(localStorageKey, 'en')
		render(<App />)
		click('carta 23')
		expect(detail()?.textContent).toBe(CARDS_EN[22].name)
	})
})
