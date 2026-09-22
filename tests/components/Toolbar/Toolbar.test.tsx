import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Toolbar } from '../../../src/components/Toolbar/Toolbar.tsx'
import { overwriteSetLocale } from '../../../src/paraglide/runtime.js'

describe('Toolbar', () => {
	it('switches the language', () => {
		const setLocale = vi.fn()
		overwriteSetLocale(setLocale)
		render(<Toolbar />)
		const english = screen.getByRole('button', { name: 'English' })
		expect(english.getAttribute('aria-pressed')).toBe('false')
		expect(
			screen
				.getByRole('button', { name: 'Português' })
				.getAttribute('aria-pressed'),
		).toBe('true')
		fireEvent.click(english)
		expect(setLocale).toHaveBeenCalledWith('en')
	})

	it('toggles the theme and remembers it', () => {
		document.documentElement.dataset.theme = 'dark'
		render(<Toolbar />)
		fireEvent.click(
			screen.getByRole('button', { name: 'Mudar para o tema claro' }),
		)
		expect(document.documentElement.dataset.theme).toBe('light')
		expect(localStorage.getItem('deck-theme')).toBe('light')
		fireEvent.click(
			screen.getByRole('button', { name: 'Mudar para o tema escuro' }),
		)
		expect(document.documentElement.dataset.theme).toBe('dark')
	})
})
