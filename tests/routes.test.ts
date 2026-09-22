import { describe, expect, it } from 'vitest'
import {
	cardIdFromLocation,
	cardPath,
	upgradeLegacyHash,
} from '../src/routes.ts'

describe('routes', () => {
	it('gives each card a path from its name', () => {
		expect(cardPath(24)).toBe('/coracao/')
	})

	it('reads the card from the path, with or without the trailing slash', () => {
		history.replaceState(null, '', '/coracao/')
		expect(cardIdFromLocation()).toBe(24)
		history.replaceState(null, '', '/ancora')
		expect(cardIdFromLocation()).toBe(35)
		history.replaceState(null, '', '/nao-existe/')
		expect(cardIdFromLocation()).toBeNull()
	})

	it('moves old hash links to the card path', () => {
		history.replaceState(null, '', '/#/cavaleiro')
		upgradeLegacyHash()
		expect(location.pathname + location.hash).toBe('/cavaleiro/')
	})

	it('leaves other hashes alone', () => {
		history.replaceState(null, '', '/#algo')
		upgradeLegacyHash()
		expect(location.pathname + location.hash).toBe('/#algo')
	})
})
