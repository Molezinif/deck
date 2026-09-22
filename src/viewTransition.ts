import { flushSync } from 'react-dom'

export function withViewTransition(update: () => void, className?: string) {
	if (
		!('startViewTransition' in document) ||
		matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		update()
		return
	}
	const root = document.documentElement
	if (className) root.classList.add(className)
	document
		.startViewTransition(() => flushSync(update))
		.finished.finally(() => {
			if (className) root.classList.remove(className)
		})
}
