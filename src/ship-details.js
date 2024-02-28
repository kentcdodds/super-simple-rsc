import { createElement as h } from 'react'
import { getImageUrlForShip } from './utils.js'
import { getShip } from '../db/ship-api.js'

export async function ShipDetails({ shipName }) {
	const shipImgSrc = getImageUrlForShip(shipName, {
		size: 200,
	})
	const ship = await getShip({ name: shipName })
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h('img', { src: shipImgSrc, alt: ship.name }),
		),
		h(
			'section',
			null,
			h(
				'h2',
				null,
				ship.name,
				h('sup', null, ship.topSpeed, ' ', h('small', null, 'lyh')),
			),
		),
		h(
			'section',
			null,
			ship.weapons.length
				? h(
						'ul',
						null,
						ship.weapons.map(weapon =>
							h(
								'li',
								{ key: weapon.name },
								h('label', null, weapon.name),
								':',
								' ',
								h(
									'span',
									null,
									weapon.damage,
									' ',
									h('small', null, '(', weapon.type, ')'),
								),
							),
						),
					)
				: h('p', null, 'NOTE: This ship is not equipped with any weapons.'),
		),
		h('small', { className: 'ship-info__fetch-time' }, ship.fetchedAt),
	)
}