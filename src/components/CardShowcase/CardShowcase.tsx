import { useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { CardData } from '../../data/cards.ts'
import { Card, type Pose } from '../Card/Card.tsx'
import { BACKGROUND, SceneLighting } from '../SceneLighting/SceneLighting.tsx'

// Facing the camera straight on: see CardShowcase.test.tsx for the
// derivation (Card's rotation convention faces "up" by default, so it takes
// a different angle here to face front-on instead).
const POSE: Pose = { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] }

type CardShowcaseProps = {
	card: CardData
}

export function CardShowcase({ card }: CardShowcaseProps) {
	return (
		<Canvas
			style={{ touchAction: 'none' }}
			camera={{ position: [0, 0, 1.35], fov: 40 }}
		>
			<color attach="background" args={[BACKGROUND]} />
			<CardShowcaseScene card={card} />
		</Canvas>
	)
}

export function CardShowcaseScene({ card }: CardShowcaseProps) {
	return (
		<>
			<SceneLighting />
			<Suspense fallback={null}>
				<CardMesh card={card} />
			</Suspense>
		</>
	)
}

function CardMesh({ card }: { card: CardData }) {
	const [front, back] = useTexture([card.front, '/cards/back.svg'])
	return (
		<Card front={front} back={back} pose={POSE} focused onSelect={() => {}} />
	)
}
