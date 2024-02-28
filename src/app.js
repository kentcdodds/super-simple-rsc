import { createElement as h, Suspense } from 'react'
import { App as ClientApp } from './app.client.js'
import { ErrorBoundary } from './error-boundary.js'
import { ShipDetails, ShipFallback, ShipError } from './ship-details.js'

export async function App() {
	const shipName = 'Dreadyacht'
	return h(
		'html',
		{
			lang: 'en',
		},
		h(
			'head',
			null,
			h('meta', { charSet: 'utf-8' }),
			h('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			}),
			h('title', null, 'Super Simple RSC'),
			h('link', { rel: 'stylesheet', href: '/src/style.css' }),
		),
		h(
			'body',
			null,
			h(
				ErrorBoundary,
				{ fallback: h(ShipError, { shipName }) },
				shipName
					? h(
							Suspense,
							{ fallback: h(ShipFallback, { shipName }) },
							h(ShipDetails, { shipName }),
						)
					: h('p', null, 'Select a ship from the list to see details'),
			),
		),
	)
}
