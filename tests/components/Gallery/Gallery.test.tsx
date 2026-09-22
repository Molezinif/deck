import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Gallery } from '../../../src/components/Gallery/Gallery.tsx'
import { CARDS } from '../../../src/data/cards.ts'

describe('Gallery', () => {
	it('shows every card as a thumbnail', () => {
		render(<Gallery cards={CARDS} activeId={null} onSelect={() => {}} />)
		for (const card of CARDS) {
			expect(screen.getByAltText(card.name)).toBeTruthy()
		}
	})

	it('reports the id of the tapped card', () => {
		const onSelect = vi.fn()
		render(<Gallery cards={CARDS} activeId={null} onSelect={onSelect} />)
		const button = screen.getByAltText(CARDS[22].name).closest('button')
		if (!button) throw new Error('gallery item button not found')
		fireEvent.click(button)
		expect(onSelect).toHaveBeenCalledWith(CARDS[22].id)
	})

	it('credits the team and links to GitHub and Buy Me a Coffee', () => {
		render(<Gallery cards={CARDS} activeId={null} onSelect={() => {}} />)
		const link = (name: string) =>
			screen.getByRole('link', { name }).getAttribute('href')
		expect(link('Luiddy')).toBe('https://www.instagram.com/luiddx/')
		expect(link('Isabelly')).toBe('https://www.instagram.com/isay.rm/')
		expect(link('Gabriel')).toBe('https://www.instagram.com/molezinif/')
		expect(link('GitHub')).toBe('https://github.com/Molezinif/deck')
		expect(link('Buy Me a Coffee')).toBe('https://buymeacoffee.com/molezinif')
	})
})
