import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { m } from './paraglide/messages.js'
import { getLocale } from './paraglide/runtime.js'

document.documentElement.lang = getLocale()
document.title = m.title()

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
