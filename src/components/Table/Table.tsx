import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { CardData } from '../../data/cards.ts'
import { BackgroundBlur } from '../BackgroundBlur/BackgroundBlur.tsx'
import { Deck } from '../Deck/Deck.tsx'
import { FOCUS_POSE } from '../Deck/layout.ts'

const BACKGROUND = '#14081f'
const CLICK_TOLERANCE = 5

type TableProps = {
	cards: CardData[]
	selectedId: number | null
	onSelect: (id: number) => void
	onDismiss: () => void
}

export function Table({ cards, selectedId, onSelect, onDismiss }: TableProps) {
	const pointerDownAt = useRef({ x: 0, y: 0 })

	return (
		<Canvas
			style={{ touchAction: 'none' }}
			camera={{ position: [0, 6, 2.2], fov: 45 }}
			onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
			onPointerDown={(event) => {
				pointerDownAt.current = { x: event.clientX, y: event.clientY }
			}}
			onPointerMissed={(event) => {
				const { x, y } = pointerDownAt.current
				if (
					Math.hypot(event.clientX - x, event.clientY - y) < CLICK_TOLERANCE
				) {
					onDismiss()
				}
			}}
		>
			<color attach="background" args={[BACKGROUND]} />
			<fog attach="fog" args={[BACKGROUND, 6, 12]} />
			<ambientLight intensity={0.6} color="#d9c6ff" />
			<directionalLight position={[2, 5, 3]} intensity={1.6} />
			<pointLight position={[0, 1.5, 0]} intensity={6} color="#9d5cff" />
			<Environment resolution={256} frames={1} environmentIntensity={0.6}>
				<Lightformer
					form="rect"
					intensity={3}
					position={[0, 6, 3]}
					rotation-x={Math.PI / 2}
					scale={[6, 3, 1]}
				/>
				<Lightformer
					form="rect"
					intensity={1.5}
					color="#c9a0ff"
					position={[-5, 3, 0]}
					rotation-y={Math.PI / 2}
					scale={[3, 5, 1]}
				/>
				<Lightformer
					form="rect"
					intensity={1.5}
					color="#f2d38a"
					position={[5, 3, 0]}
					rotation-y={-Math.PI / 2}
					scale={[3, 5, 1]}
				/>
			</Environment>
			<Sparkles
				count={120}
				scale={[9, 3, 6]}
				size={2.5}
				speed={0.3}
				color="#f2d38a"
			/>
			<Suspense fallback={null}>
				<Deck
					cards={cards}
					back="/cards/back.svg"
					selectedId={selectedId}
					onSelect={onSelect}
				/>
			</Suspense>
			<BackgroundBlur
				active={selectedId !== null}
				focus={FOCUS_POSE.position}
			/>
		</Canvas>
	)
}
