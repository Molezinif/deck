import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'deck-theme'
const listeners = new Set<() => void>()

export const getTheme = (): Theme =>
	document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

function subscribe(listener: () => void) {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme
	try {
		localStorage.setItem(STORAGE_KEY, theme)
	} catch {}
	for (const listener of listeners) listener()
}

export function toggleTheme() {
	const next = getTheme() === 'dark' ? 'light' : 'dark'
	if (
		!('startViewTransition' in document) ||
		matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		applyTheme(next)
		return
	}
	const root = document.documentElement
	root.classList.add('theme-switching')
	document
		.startViewTransition(() => flushSync(() => applyTheme(next)))
		.finished.finally(() => root.classList.remove('theme-switching'))
}

export const useTheme = () => useSyncExternalStore(subscribe, getTheme)
