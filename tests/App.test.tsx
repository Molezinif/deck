import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../src/App.tsx'
import { CARDS } from '../src/data/cards.ts'

type TableProps = {
	selectedId: number | null
	onSelect: (id: number) => void
	onDismiss: () => void
}

vi.mock('../src/components/Table/Table.tsx', () => ({
	Table: ({ selectedId, onSelect, onDismiss }: TableProps) => (
		<div>
			<output>{String(selectedId)}</output>
			<button type="button" onClick={() => onSelect(1)}>
				carta 1
			</button>
			<button type="button" onClick={() => onSelect(23)}>
				carta 23
			</button>
			<button type="button" onClick={onDismiss}>
				fora
			</button>
		</div>
	),
}))

const wiki = () => screen.queryByRole('complementary')
const selected = () => screen.getByRole('status').textContent
const click = (name: string) =>
	fireEvent.click(screen.getByRole('button', { name }))

describe('App', () => {
	it('starts with no card selected', () => {
		render(<App />)
		expect(selected()).toBe('null')
		expect(wiki()).toBeNull()
	})

	it('opens the wiki of the selected card', () => {
		render(<App />)
		click('carta 23')
		expect(selected()).toBe('23')
		expect(wiki()?.textContent).toContain(CARDS[22].name)
	})

	it('switches to another card', () => {
		render(<App />)
		click('carta 23')
		click('carta 1')
		expect(wiki()?.textContent).toContain(CARDS[0].name)
	})

	it('closes when the same card is selected again', () => {
		render(<App />)
		click('carta 23')
		click('carta 23')
		expect(wiki()).toBeNull()
	})

	it('closes on the close button', () => {
		render(<App />)
		click('carta 23')
		click('Fechar')
		expect(selected()).toBe('null')
	})

	it('closes when the table is dismissed', () => {
		render(<App />)
		click('carta 23')
		click('fora')
		expect(wiki()).toBeNull()
	})
})
