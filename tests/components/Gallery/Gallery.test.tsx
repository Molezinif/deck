import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Gallery } from '../../../src/components/Gallery/Gallery.tsx'
import { CARDS } from '../../../src/data/cards.ts'

describe('Gallery', () => {
	it('shows every card as a thumbnail', () => {
		render(<Gallery cards={CARDS} activeId={null} onSelect={() => {}} />)
		expect(screen.getAllByRole('button')).toHaveLength(36)
		expect(screen.getByAltText(CARDS[0].name)).toBeTruthy()
	})

	it('reports the id of the tapped card', () => {
		const onSelect = vi.fn()
		render(<Gallery cards={CARDS} activeId={null} onSelect={onSelect} />)
		const button = screen.getByAltText(CARDS[22].name).closest('button')
		if (!button) throw new Error('gallery item button not found')
		fireEvent.click(button)
		expect(onSelect).toHaveBeenCalledWith(CARDS[22].id)
	})

	it('credits the team and links to GitHub', () => {
		render(<Gallery cards={CARDS} activeId={null} onSelect={() => {}} />)
		expect(screen.getByText('Luiddy')).toBeTruthy()
		expect(screen.getByText('Isabelly')).toBeTruthy()
		expect(
			screen.getByRole('link', { name: 'GitHub' }).getAttribute('href'),
		).toBe('https://github.com/Molezinif/deck')
	})
})
