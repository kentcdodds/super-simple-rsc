import { createElement as h } from 'react'
import { getImageUrlForShip } from './utils.js'
import { searchShips } from '../db/ship-api.js'
import { ShipImg } from './img.js'
import { asyncLocalStorage } from '../server/region-async-storage.js'
import { SelectShipButton } from './ship-search.js'

const shipFallbackSrc = '/img/fallback-ship.png'

export async function SearchResults() {
	const { search } = asyncLocalStorage.getStore()
	const shipResults = await searchShips({ query: search })
	return shipResults.ships.map(ship =>
		h(
			'li',
			{ key: ship.name },
			h(
				SelectShipButton,
				{ shipName: ship.name },
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

export function SearchResultsFallback() {
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
