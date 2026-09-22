import { Environment, Lightformer } from '@react-three/drei'
import { useTheme } from '../../theme.ts'

const AMBIENT = {
	dark: { color: '#d9c6ff', intensity: 0.6 },
	light: { color: '#fff1dc', intensity: 1.1 },
}
const ACCENT = {
	dark: { color: '#9d5cff', intensity: 6 },
	light: { color: '#f2c77a', intensity: 3 },
}

export function SceneLighting() {
	const theme = useTheme()

	return (
		<>
			<ambientLight {...AMBIENT[theme]} />
			<directionalLight position={[2, 5, 3]} intensity={1.6} />
			<pointLight position={[0, 1.5, 0]} {...ACCENT[theme]} />
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
