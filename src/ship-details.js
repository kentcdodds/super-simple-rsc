import { createElement as h } from 'react'
import { getImageUrlForShip } from './utils.js'
import { getShip } from '../db/ship-api.js'
import { ShipImg } from './img.js'
import { asyncLocalStorage } from '../server/region-async-storage.js'
import { EditableText } from './edit-text.ts'
import { updateShipName } from './actions.js'

export async function ShipDetails() {
	const { shipId } = asyncLocalStorage.getStore()
	const ship = await getShip({ shipId })
	const shipImgSrc = getImageUrlForShip(ship.id, { size: 200 })
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
				h(EditableText, {
					key: shipId,
					shipId,
					action: updateShipName,
					initialValue: ship.name,
				}),
			),
		),
		h('div', null, 'Top Speed: ', ship.topSpeed, ' ', h('small', null, 'lyh')),
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
	)
}

export function ShipFallback() {
	const { shipId } = asyncLocalStorage.getStore()
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h(ShipImg, {
				src: getImageUrlForShip(shipId, {
					size: 200,
				}),
				// TODO: handle this better
				alt: shipId,
			}),
		),
		h('section', null, h('h2', null, 'Loading...')),
		h('div', null, 'Top Speed: XX', ' ', h('small', null, 'lyh')),
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

export function ShipError() {
	const { shipId } = asyncLocalStorage.getStore()
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h('img', { src: '/img/broken-ship.webp', alt: 'broken ship' }),
		),
		h('section', null, h('h2', null, 'There was an error')),
		h('section', null, 'There was an error loading "', shipId, '"'),
	)
}
