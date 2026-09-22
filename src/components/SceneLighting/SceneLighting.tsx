import { Environment, Lightformer } from '@react-three/drei'

export function SceneLighting() {
	return (
		<>
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
		</>
	)
}
