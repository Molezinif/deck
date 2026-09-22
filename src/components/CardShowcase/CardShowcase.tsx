import { ContactShadows, Float, Sparkles, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import {
	type ReactNode,
	type RefObject,
	Suspense,
	useEffect,
	useRef,
} from 'react'
import { type Group, MathUtils, type PerspectiveCamera } from 'three'
import { BACK_IMAGE, type CardData } from '../../data/cards.ts'
import { feedback, haptic } from '../../feedback.ts'
import { useTheme } from '../../theme.ts'
import { Card, type Pose } from '../Card/Card.tsx'
import { CARD_HEIGHT } from '../Card/geometry.ts'
import { SceneLighting } from '../SceneLighting/SceneLighting.tsx'

// Facing the camera straight on: see CardShowcase.test.tsx for the
// derivation (Card's rotation convention faces "up" by default, so it takes
// a different angle here to face front-on instead).
const POSE: Pose = { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] }
const ENTRY_DEPTH = -0.6
const FRAMING_SPEED = 6
const TILT_SPEED = 3
const POINTER_TILT = { x: 0.08, y: 0.14 }
const SHADOW_OFFSET = 0.1
const DUST = { dark: '#f2d38a', light: '#b07a1c' }
const SHADOW_OPACITY = { dark: 0.55, light: 0.25 }

type CardShowcaseProps = {
	card: CardData
	direction: 1 | -1
	upcoming: string[]
	slot: RefObject<HTMLElement | null>
}

const prefersReducedMotion = () =>
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function CardShowcase(props: CardShowcaseProps) {
	return (
		<Canvas
			style={{ touchAction: 'none' }}
			flat
			dpr={[1, 2]}
			camera={{ position: [0, 0, 1.35], fov: 40 }}
		>
			<CardShowcaseScene {...props} />
		</Canvas>
	)
}

export function CardShowcaseScene({
	card,
	direction,
	upcoming,
	slot,
}: CardShowcaseProps) {
	const still = prefersReducedMotion()
	const theme = useTheme()

	useEffect(() => {
		for (const front of upcoming) useTexture.preload([front, BACK_IMAGE])
	}, [upcoming])

	return (
		<>
			<SlotFraming slot={slot} />
			<SceneLighting />
			<Sparkles
				count={40}
				scale={[2.4, 1.6, 1.2]}
				size={1.8}
				speed={still ? 0 : 0.25}
				opacity={0.7}
				color={DUST[theme]}
			/>
			<ContactShadows
				position={[0, -CARD_HEIGHT / 2 - SHADOW_OFFSET, 0]}
				scale={1.4}
				blur={2.4}
				far={1}
				opacity={SHADOW_OPACITY[theme]}
				resolution={256}
			/>
			<Float
				enabled={!still}
				speed={1.4}
				rotationIntensity={0.25}
				floatIntensity={0.4}
				floatingRange={[-0.02, 0.02]}
			>
				<PointerTilt>
					<Suspense fallback={null}>
						<CardMesh
							key={card.id}
							card={card}
							from={still ? undefined : entryPose(direction)}
						/>
					</Suspense>
				</PointerTilt>
			</Float>
		</>
	)
}

// A new card arrives face down from behind and turns over, the way a card
// is revealed in a reading; navigating backwards turns it the other way.
const entryPose = (direction: 1 | -1): Pose => ({
	position: [0, 0, ENTRY_DEPTH],
	rotation: [POSE.rotation[0], 0, direction * Math.PI],
})

function PointerTilt({ children }: { children: ReactNode }) {
	const ref = useRef<Group>(null)

	useFrame(({ pointer }, delta) => {
		const group = ref.current
		if (!group) return
		const t = 1 - Math.exp(-TILT_SPEED * delta)
		group.rotation.x += (-pointer.y * POINTER_TILT.x - group.rotation.x) * t
		group.rotation.y += (pointer.x * POINTER_TILT.y - group.rotation.y) * t
	})

	return <group ref={ref}>{children}</group>
}

// The canvas covers the whole screen so a tilted card never gets clipped;
// the camera is instead aimed and zoomed so the resting card lands exactly
// on the slot element the page layout reserves for it.
function SlotFraming({ slot }: { slot: RefObject<HTMLElement | null> }) {
	const framing = useRef<{ z: number; x: number; y: number } | null>(null)

	useFrame(({ camera, size }, delta) => {
		const rect = slot.current?.getBoundingClientRect()
		if (!rect || rect.height === 0) return
		const perspective = camera as PerspectiveCamera
		const tan = Math.tan(MathUtils.degToRad(perspective.fov / 2))
		const goal = {
			z: (CARD_HEIGHT * size.height) / (2 * rect.height * tan),
			x: size.width / 2 - (rect.left - size.left + rect.width / 2),
			y: size.height / 2 - (rect.top - size.top + rect.height / 2),
		}
		const current = framing.current ?? goal
		const t = 1 - Math.exp(-FRAMING_SPEED * delta)
		current.z += (goal.z - current.z) * t
		current.x += (goal.x - current.x) * t
		current.y += (goal.y - current.y) * t
		framing.current = current
		perspective.position.set(0, 0, current.z)
		perspective.setViewOffset(
			size.width,
			size.height,
			current.x,
			current.y,
			size.width,
			size.height,
		)
	})

	return null
}

function CardMesh({ card, from }: { card: CardData; from?: Pose }) {
	const [front, back] = useTexture([card.front, BACK_IMAGE])
	return (
		<Card
			front={front}
			back={back}
			pose={POSE}
			from={from}
			focused
			onSelect={() => {}}
			onTurn={() => haptic('tick')}
			onSettle={() => feedback('settle', 0.7)}
		/>
	)
}
