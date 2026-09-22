import { fireEvent, render, screen } from '@testing-library/react'
import type { PointerEventHandler, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Table } from '../../../src/components/Table/Table.tsx'
import { CARDS } from '../../../src/data/cards.ts'

vi.mock('@react-three/drei', () => ({ Sparkles: () => null }))
vi.mock('../../../src/components/Deck/Deck.tsx', () => ({ Deck: () => null }))
vi.mock('../../../src/components/BackgroundBlur/BackgroundBlur.tsx', () => ({
	BackgroundBlur: () => null,
}))

vi.mock('@react-three/fiber', () => ({
	Canvas: ({
		onPointerDown,
		onPointerMissed,
	}: {
		children: ReactNode
		onPointerDown: PointerEventHandler
		onPointerMissed: (event: MouseEvent) => void
	}) => (
		<button
			type="button"
			data-testid="canvas"
			onPointerDown={onPointerDown}
			onClick={(event) => onPointerMissed(event.nativeEvent)}
		/>
	),
}))

function renderTable() {
	const onDismiss = vi.fn()
	render(
		<Table
			cards={CARDS}
			selectedId={23}
			onSelect={() => {}}
			onDismiss={onDismiss}
		/>,
	)
	return { canvas: screen.getByTestId('canvas'), onDismiss }
}

describe('Table', () => {
	it('dismisses on a click outside the cards', () => {
		const { canvas, onDismiss } = renderTable()
		fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
		fireEvent.click(canvas, { clientX: 12, clientY: 11 })
		expect(onDismiss).toHaveBeenCalledOnce()
	})

	it('keeps the card when a drag ends outside the cards', () => {
		const { canvas, onDismiss } = renderTable()
		fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
		fireEvent.click(canvas, { clientX: 200, clientY: 10 })
		expect(onDismiss).not.toHaveBeenCalled()
	})
})
