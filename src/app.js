import { createElement as h, Suspense } from 'react'
import { ErrorBoundary } from './error-boundary.js'
import { ShipDetails, ShipFallback, ShipError } from './ship-details.js'
import { ShipSearch } from './ship-search.js'
import { SearchResults } from './ship-search-results.js'

const shipFallbackSrc = '/img/fallback-ship.png'

export async function App({ shipName, search }) {
	return h(
		'html',
		{ lang: 'en' },
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
				'div',
				{ className: 'app-wrapper' },
				h(
					'div',
					{ className: 'app' },
					h(
						ErrorBoundary,
						{
							fallback: h(
								'div',
								{ className: 'app-error' },
								h('p', null, 'Something went wrong!'),
							),
						},
						h(
							Suspense,
							{
								fallback: h('img', {
									style: { maxWidth: 400 },
									src: shipFallbackSrc,
								}),
							},
							h(
								'div',
								{ className: 'search' },
								h(ShipSearch, {
									search,
									results: h(SearchResults, { search }),
								}),
							),
							h(
								'div',
								{ className: 'details' },
								h(
									ErrorBoundary,
									{ fallback: h(ShipError, { shipName }) },
									shipName
										? h(
												Suspense,
												{ fallback: h(ShipFallback, { shipName }) },
												h(ShipDetails, { shipName }),
											)
										: h(
												'p',
												null,
												'Select a ship from the list to see details',
											),
								),
							),
						),
					),
				),
			),
		),
	)
}
