import { useCursor } from '@react-three/drei'
import { type ThreeEvent, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import {
	AdditiveBlending,
	type Group,
	MathUtils,
	type MeshBasicMaterial,
	type Texture,
	Vector3,
} from 'three'
import {
	CARD_THICKNESS,
	edgeGeometry,
	faceGeometry,
	sheenTexture,
} from './geometry.ts'
import type { Pose } from './layout.ts'

const EDGE_COLOR = '#e8e2d6'
const HOVER_LIFT = 0.04
const SPEED = 8
const DRAG_SENSITIVITY = 0.01
const MAX_TILT = 0.8
const SHEEN_STRENGTH = 0.5
const MAX_SHEEN = 0.8
const SHEEN_TRAVEL = 0.9

type CardProps = {
	front: Texture
	back: Texture
	pose: Pose
	focused: boolean
	onSelect: () => void
}

export function Card({ front, back, pose, focused, onSelect }: CardProps) {
	const ref = useRef<Group>(null)
	const sheenRef = useRef<MeshBasicMaterial>(null)
	const [initial] = useState(pose)
	const [target] = useState(() => new Vector3())
	const [sheen] = useState(() => sheenTexture.clone())
	const previousRotation = useRef({ x: initial.rotation[0], z: 0 })
	const [hovered, setHovered] = useState(false)
	const spin = useRef({ x: 0, z: 0 })
	const dragging = useRef(false)
	const lastPointer = useRef({ x: 0, y: 0 })
	useCursor(hovered, focused ? 'grab' : 'pointer')

	useFrame((_, delta) => {
		const card = ref.current
		if (!card || delta === 0) return
		if (!focused && (spin.current.x !== 0 || spin.current.z !== 0)) {
			spin.current = { x: 0, z: 0 }
			card.rotation.z =
				MathUtils.euclideanModulo(card.rotation.z + Math.PI, Math.PI * 2) -
				Math.PI
		}
		const t = 1 - Math.exp(-SPEED * delta)
		const [x, y, z] = pose.position
		const lift = hovered && !focused ? HOVER_LIFT : 0
		card.position.lerp(target.set(x, y + lift, z), t)
		card.rotation.x += (pose.rotation[0] + spin.current.x - card.rotation.x) * t
		card.rotation.y += (pose.rotation[1] - card.rotation.y) * t
		card.rotation.z += (spin.current.z - card.rotation.z) * t

		const turned =
			Math.abs(card.rotation.x - previousRotation.current.x) +
			Math.abs(card.rotation.z - previousRotation.current.z)
		previousRotation.current = { x: card.rotation.x, z: card.rotation.z }
		const material = sheenRef.current
		if (!material) return
		const glow = Math.min((turned / delta) * SHEEN_STRENGTH, MAX_SHEEN)
		material.opacity += (glow - material.opacity) * t
		sheen.offset.x =
			(Math.sin(card.rotation.z) + card.rotation.x - pose.rotation[0]) *
			SHEEN_TRAVEL
	})

	const handleClick = (event: ThreeEvent<MouseEvent>) => {
		event.stopPropagation()
		if (!focused) onSelect()
	}

	const handleOver = (event: ThreeEvent<PointerEvent>) => {
		event.stopPropagation()
		setHovered(true)
	}

	const handleDown = (event: ThreeEvent<PointerEvent>) => {
		if (!focused) return
		event.stopPropagation()
		dragging.current = true
		lastPointer.current = { x: event.clientX, y: event.clientY }
		;(event.target as Element).setPointerCapture(event.pointerId)
	}

	const handleMove = (event: ThreeEvent<PointerEvent>) => {
		if (!dragging.current || !focused) return
		const deltaX = event.clientX - lastPointer.current.x
		const deltaY = event.clientY - lastPointer.current.y
		lastPointer.current = { x: event.clientX, y: event.clientY }
		spin.current.z += deltaX * DRAG_SENSITIVITY
		spin.current.x = MathUtils.clamp(
			spin.current.x + deltaY * DRAG_SENSITIVITY,
			-MAX_TILT,
			MAX_TILT,
		)
	}

	const handleUp = (event: ThreeEvent<PointerEvent>) => {
		dragging.current = false
		;(event.target as Element).releasePointerCapture(event.pointerId)
	}

	return (
		<group
			ref={ref}
			position={initial.position}
			rotation={initial.rotation}
			onClick={handleClick}
			onPointerOver={handleOver}
			onPointerOut={() => setHovered(false)}
			onPointerDown={handleDown}
			onPointerMove={handleMove}
			onPointerUp={handleUp}
		>
			<group rotation={[-Math.PI / 2, 0, 0]}>
				<mesh geometry={edgeGeometry}>
					<meshStandardMaterial attach="material-0" visible={false} />
					<meshStandardMaterial attach="material-1" color={EDGE_COLOR} />
				</mesh>
				<mesh geometry={faceGeometry} position={[0, 0, CARD_THICKNESS / 2]}>
					<meshStandardMaterial map={back} />
				</mesh>
				<group
					position={[0, 0, -CARD_THICKNESS / 2]}
					rotation={[Math.PI, 0, 0]}
				>
					<mesh geometry={faceGeometry}>
						<meshStandardMaterial map={front} />
					</mesh>
					<mesh geometry={faceGeometry} position={[0, 0, 0.0005]}>
						<meshBasicMaterial
							ref={sheenRef}
							map={sheen}
							transparent
							opacity={0}
							blending={AdditiveBlending}
							depthWrite={false}
						/>
					</mesh>
				</group>
			</group>
		</group>
	)
}
