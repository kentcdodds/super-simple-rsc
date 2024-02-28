import { createElement as h } from 'react'
import { getImageUrlForShip } from './utils.js'
import { searchShips } from '../db/ship-api.js'
import { ShipImg } from './img.js'

export async function SearchResults({ search }) {
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
