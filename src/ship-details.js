import { createElement as h } from 'react'
import { getImageUrlForShip } from './utils.js'
import { getShip } from '../db/ship-api.js'
import { ShipImg } from './img.js'

export async function ShipDetails({ shipName }) {
	const shipImgSrc = getImageUrlForShip(shipName, { size: 200 })
	const ship = await getShip({ name: shipName })
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h(ShipImg, { src: shipImgSrc, alt: ship.name }),
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

export function ShipFallback({ shipName }) {
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h(ShipImg, {
				src: getImageUrlForShip(shipName, {
					size: 200,
				}),
				alt: shipName,
			}),
		),
		h(
			'section',
			null,
			h('h2', null, shipName, h('sup', null, 'XX ', h('small', null, 'lyh'))),
		),
		h(
			'section',
			null,
			h(
				'ul',
				null,
				Array.from({ length: 3 }).map((_, i) =>
					h(
						'li',
						{ key: i },
						h('label', null, 'loading'),
						':',
						' ',
						h('span', null, 'XX ', h('small', null, '(loading)')),
					),
				),
			),
		),
	)
}

export function ShipError({ shipName }) {
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h('img', { src: '/img/broken-ship.webp', alt: 'broken ship' }),
		),
		h('section', null, h('h2', null, 'There was an error')),
		h('section', null, 'There was an error loading "', shipName, '"'),
	)
}
