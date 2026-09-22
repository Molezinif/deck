import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import type { Plugin } from 'vite'
import entries from '../src/data/cards.json' with { type: 'json' }
import { slugify } from '../src/data/slugify.ts'

const TITLE = 'Baralho Cigano'
const DESCRIPTION =
	'As 36 cartas do baralho cigano, com o significado de cada uma no amor, no trabalho e na saúde.'
const OG = { width: 1200, height: 630 }
const CARD_HEIGHT = 540
const CARD_WIDTH = Math.round((CARD_HEIGHT * 791) / 1169)

export type PageMeta = {
	title: string
	description: string
	url: string
	image: string
}

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function headTags({ title, description, url, image }: PageMeta) {
	return [
		`<title>${escapeHtml(title)}</title>`,
		`<meta name="description" content="${escapeHtml(description)}" />`,
		`<link rel="canonical" href="${url}" />`,
		`<meta property="og:type" content="website" />`,
		`<meta property="og:site_name" content="${TITLE}" />`,
		`<meta property="og:locale" content="pt_BR" />`,
		`<meta property="og:title" content="${escapeHtml(title)}" />`,
		`<meta property="og:description" content="${escapeHtml(description)}" />`,
		`<meta property="og:url" content="${url}" />`,
		`<meta property="og:image" content="${image}" />`,
		`<meta property="og:image:width" content="${OG.width}" />`,
		`<meta property="og:image:height" content="${OG.height}" />`,
		`<meta name="twitter:card" content="summary_large_image" />`,
	].join('\n    ')
}

const cards = entries.map((entry, i) => ({
	slug: slugify(entry.name),
	title: `${entry.name} · ${TITLE}`,
	description: entry.meaning,
	file: entry.image ?? `${String(i + 1).padStart(2, '0')}.svg`,
}))

function cardImage(file: string, rotate = 0) {
	return sharp(`public/cards/${file}`, { density: 150 })
		.resize({ width: CARD_WIDTH, height: CARD_HEIGHT, fit: 'cover' })
		.composite([
			{
				input: Buffer.from(
					`<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}"><rect width="100%" height="100%" rx="22"/></svg>`,
				),
				blend: 'dest-in',
			},
		])
		.png()
		.toBuffer()
		.then((buffer) =>
			sharp(buffer)
				.rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
				.png()
				.toBuffer(),
		)
}

async function previewImage(file?: string) {
	const background = Buffer.from(
		`<svg width="${OG.width}" height="${OG.height}"><defs><radialGradient id="g" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#3a1a5e"/><stop offset="1" stop-color="#14081f"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
	)
	const back = await cardImage('back.svg', file ? 10 : -8)
	const layers = [{ input: back, top: 20, left: file ? 560 : 330 }]
	if (file)
		layers.push({ input: await cardImage(file, -4), top: 30, left: 330 })
	else
		layers.push({ input: await cardImage('back.svg', 8), top: 20, left: 520 })
	return sharp(background).composite(layers).jpeg({ quality: 82 }).toBuffer()
}

// Builds a real page per card so link previews (WhatsApp, Instagram…) show
// that card, since crawlers don't run the app; 404.html lets GitHub Pages
// fall back to the app for any other address.
export function cardPages(siteUrl: string): Plugin {
	const home: PageMeta = {
		title: TITLE,
		description: DESCRIPTION,
		url: siteUrl,
		image: `${siteUrl}og/home.jpg`,
	}
	let outDir = 'dist'

	return {
		name: 'card-pages',
		configResolved(config) {
			outDir = config.build.outDir
		},
		transformIndexHtml: (html) =>
			html.replace(`<title>${TITLE}</title>`, headTags(home)),
		async closeBundle() {
			const html = await readFile(`${outDir}/index.html`, 'utf8')
			const defaultHead = headTags(home)
			await mkdir(`${outDir}/og`, { recursive: true })
			await writeFile(`${outDir}/og/home.jpg`, await previewImage())
			await writeFile(`${outDir}/404.html`, html)
			for (const card of cards) {
				const page = headTags({
					title: card.title,
					description: card.description,
					url: `${siteUrl}${card.slug}/`,
					image: `${siteUrl}og/${card.slug}.jpg`,
				})
				await mkdir(`${outDir}/${card.slug}`, { recursive: true })
				await writeFile(
					`${outDir}/${card.slug}/index.html`,
					html.replace(defaultHead, page),
				)
				await writeFile(
					`${outDir}/og/${card.slug}.jpg`,
					await previewImage(card.file),
				)
			}
		},
	}
}
