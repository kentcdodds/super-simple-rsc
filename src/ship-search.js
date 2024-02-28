import { createElement as h, Fragment, Suspense } from 'react'
import { ErrorBoundary } from './error-boundary.js'
import { getImageUrlForShip } from './utils.js'
import { searchShips } from '../db/ship-api.js'
import { ShipImg } from './img.js'

const shipFallbackSrc = '/img/fallback-ship.png'

export function ShipSearch() {
	const search = ''
	return h(
		Fragment,
		null,
		h(
			'div',
			null,
			h('input', {
				placeholder: 'Filter ships...',
				type: 'search',
				defaultValue: search,
			}),
		),
		h(
			ErrorBoundary,
			{
				fallback: h(
					'div',
					{ style: { padding: 6, color: '#CD0DD5' } },
					'There was an error retrieving results',
				),
			},
			h(
				'ul',
				null,
				h(
					Suspense,
					{ fallback: h(SearchResultsFallback) },
					h(SearchResults, { search }),
				),
			),
		),
	)
}

function SearchResultsFallback() {
	return Array.from({
		length: 12,
	}).map((_, i) =>
		h(
			'li',
			{ key: i },
			h(
				'button',
				null,
				h('img', {
					src: shipFallbackSrc,
					alt: 'loading',
				}),
				'... loading',
			),
		),
	)
}

async function SearchResults({ search }) {
	const shipResults = await searchShips({ query: search })
	return shipResults.ships.map(ship =>
		h(
			'li',
			{ key: ship.name },
			h(
				'button',
				null,
				h(ShipImg, {
					src: getImageUrlForShip(ship.name, {
						size: 20,
					}),
					alt: ship.name,
				}),
				ship.name,
			),
		),
	)
}
