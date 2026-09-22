import { useFrame } from '@react-three/fiber'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import type { DepthOfFieldEffect } from 'postprocessing'
import { useRef } from 'react'
import type { Vector3Tuple } from 'three'

const MAX_BOKEH = 6
const SPEED = 6

type BackgroundBlurProps = {
	active: boolean
	focus: Vector3Tuple
}

export function BackgroundBlur({ active, focus }: BackgroundBlurProps) {
	const ref = useRef<DepthOfFieldEffect>(null)

	useFrame((_, delta) => {
		const effect = ref.current
		if (!effect) return
		const t = 1 - Math.exp(-SPEED * delta)
		effect.bokehScale += ((active ? MAX_BOKEH : 0) - effect.bokehScale) * t
	})

	return (
		<EffectComposer>
			<DepthOfField ref={ref} target={focus} focusRange={0.6} bokehScale={0} />
		</EffectComposer>
	)
}
