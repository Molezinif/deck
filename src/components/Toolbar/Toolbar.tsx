import { m } from '../../paraglide/messages.js'
import {
	getLocale,
	type Locale,
	locales,
	setLocale,
} from '../../paraglide/runtime.js'
import { toggleTheme, useTheme } from '../../theme.ts'
import './Toolbar.css'

const LANGUAGE_NAMES: Record<Locale, string> = {
	pt: 'Português',
	en: 'English',
}

export function Toolbar() {
	const theme = useTheme()

	return (
		<div className="toolbar">
			<fieldset className="toolbar-languages">
				<legend>{m.language()}</legend>
				{locales.map((locale) => (
					<button
						key={locale}
						type="button"
						lang={locale}
						aria-label={LANGUAGE_NAMES[locale]}
						aria-pressed={getLocale() === locale}
						onClick={() => setLocale(locale)}
					>
						{locale.toUpperCase()}
					</button>
				))}
			</fieldset>
			<button
				type="button"
				className="toolbar-theme"
				onClick={toggleTheme}
				aria-label={theme === 'dark' ? m.switch_to_light() : m.switch_to_dark()}
			>
				<svg
					viewBox="0 0 24 24"
					width="18"
					height="18"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{theme === 'dark' ? (
						<>
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
						</>
					) : (
						<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
					)}
				</svg>
			</button>
		</div>
	)
}
