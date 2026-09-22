import { useSyncExternalStore } from 'react'

const SOUNDS = {
	flip: ['card-slide-1', 'card-slide-2', 'card-slide-3', 'card-slide-4'],
	settle: ['card-place-1', 'card-place-2', 'card-place-4'],
	fan: ['card-fan-1'],
}
const VOLUME = 0.3
const VIBRATION_MS = { tap: 10, tick: 4 }
const STORAGE_KEY = 'deck-sound'

type Sound = keyof typeof SOUNDS

const soundsPath = `${import.meta.env.BASE_URL}sounds`
const buffers = new Map<string, Promise<AudioBuffer>>()
const listeners = new Set<() => void>()
let context: AudioContext | undefined

export function isSoundOn() {
	try {
		return localStorage.getItem(STORAGE_KEY) !== 'off'
	} catch {
		return true
	}
}

export function toggleSound() {
	try {
		localStorage.setItem(STORAGE_KEY, isSoundOn() ? 'off' : 'on')
	} catch {}
	for (const listener of listeners) listener()
}

export const useSoundOn = () =>
	useSyncExternalStore((listener) => {
		listeners.add(listener)
		return () => listeners.delete(listener)
	}, isSoundOn)

function load(name: string) {
	let buffer = buffers.get(name)
	if (!buffer && context) {
		const audio = context
		buffer = fetch(`${soundsPath}/${name}.m4a`)
			.then((response) => response.arrayBuffer())
			.then((data) => audio.decodeAudioData(data))
		buffers.set(name, buffer)
	}
	return buffer
}

export function play(sound: Sound, volume = 1) {
	if (!isSoundOn() || typeof AudioContext === 'undefined') return
	if (!context) {
		context = new AudioContext()
		for (const variants of Object.values(SOUNDS)) variants.forEach(load)
	}
	const audio = context
	const variants = SOUNDS[sound]
	const name = variants[Math.floor(Math.random() * variants.length)]
	load(name)
		?.then((buffer) => {
			const source = audio.createBufferSource()
			const gain = audio.createGain()
			source.buffer = buffer
			source.playbackRate.value = 0.95 + Math.random() * 0.1
			gain.gain.value = VOLUME * volume
			source.connect(gain).connect(audio.destination)
			source.start()
		})
		.catch(() => {})
}

// iOS Safari has no Vibration API and closed the native switch workaround
// in iOS 26.5, so haptics only reach browsers that implement vibrate.
export function haptic(kind: keyof typeof VIBRATION_MS = 'tap') {
	if ('vibrate' in navigator) navigator.vibrate(VIBRATION_MS[kind])
}

export function feedback(sound: Sound, volume?: number) {
	haptic()
	play(sound, volume)
}
