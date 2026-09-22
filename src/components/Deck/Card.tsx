import { useCursor } from '@react-three/drei'
import { type ThreeEvent, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { type Group, MathUtils, type Texture, Vector3 } from 'three'
import { CARD_THICKNESS, edgeGeometry, faceGeometry } from './geometry.ts'
import type { Pose } from './layout.ts'

const EDGE_COLOR = '#e8e2d6'
const HOVER_LIFT = 0.04
const SPEED = 8
const DRAG_SENSITIVITY = 0.01
const MAX_TILT = 0.8
const FINISH = { roughness: 0.55, clearcoat: 0.5, clearcoatRoughness: 0.3 }

type CardProps = {
	front: Texture
	back: Texture
	pose: Pose
	focused: boolean
	onSelect: () => void
}

export function Card({ front, back, pose, focused, onSelect }: CardProps) {
	const ref = useRef<Group>(null)
	const [initial] = useState(pose)
	const [target] = useState(() => new Vector3())
	const [hovered, setHovered] = useState(false)
	const spin = useRef({ x: 0, z: 0 })
	const dragging = useRef(false)
	const lastPointer = useRef({ x: 0, y: 0 })
	useCursor(hovered, focused ? 'grab' : 'pointer')

	useFrame((_, delta) => {
		const card = ref.current
		if (!card) return
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
					<meshPhysicalMaterial map={back} {...FINISH} />
				</mesh>
				<mesh
					geometry={faceGeometry}
					position={[0, 0, -CARD_THICKNESS / 2]}
					rotation={[Math.PI, 0, 0]}
				>
					<meshPhysicalMaterial map={front} {...FINISH} />
				</mesh>
			</group>
		</group>
	)
}
