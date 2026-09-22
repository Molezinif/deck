import { describe, expect, it } from 'vitest'
import { headTags } from '../scripts/cardPages.ts'

describe('headTags', () => {
	it('describes a page for link previews, escaping the text', () => {
		const head = headTags({
			title: 'Cavaleiro · Baralho Cigano',
			description: 'Notícias "rápidas" & boas',
			url: 'https://example.com/deck/cavaleiro/',
			image: 'https://example.com/deck/og/cavaleiro.jpg',
		})
		expect(head).toContain('<title>Cavaleiro · Baralho Cigano</title>')
		expect(head).toContain(
			'<meta property="og:description" content="Notícias &quot;rápidas&quot; &amp; boas" />',
		)
		expect(head).toContain(
			'<meta property="og:image" content="https://example.com/deck/og/cavaleiro.jpg" />',
		)
		expect(head).toContain(
			'<meta property="og:url" content="https://example.com/deck/cavaleiro/" />',
		)
	})
})
