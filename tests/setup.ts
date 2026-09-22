import { beforeEach } from 'vitest'
import { localStorageKey } from '../src/paraglide/runtime.js'

beforeEach(() => {
	localStorage.setItem(localStorageKey, 'pt')
	history.replaceState(null, '', '/')
})
