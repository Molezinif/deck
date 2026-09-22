import { useEffect } from 'react'

export function useKeyDown(handlers: Record<string, () => void>) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => handlers[event.key]?.()
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handlers])
}
