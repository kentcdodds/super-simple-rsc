'use client'

import {
	Suspense,
	use,
	useDeferredValue,
	useState,
	useTransition,
	createElement as h,
	Fragment,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSpinDelay } from './spin-delay.js'
import { getImageUrlForShip, getShip, imgSrc, searchShips } from './utils.js'

const shipFallbackSrc = '/img/fallback-ship.png'

export function App() {
	const [shipName, setShipName] = useState('Dreadnought')
	const [isTransitionPending, startTransition] = useTransition()
	const isPending = useSpinDelay(isTransitionPending)
	return h(
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
							onSelection: selection => {
								startTransition(() => setShipName(selection))
							},
						}),
					),
					h(
						'div',
						{ className: 'details', style: { opacity: isPending ? 0.6 : 1 } },
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
				),
			),
		),
	)
}
function ShipSearch({ onSelection }) {
	const [search, setSearch] = useState('')
	const deferredSearch = useDeferredValue(search)
	const isPending = useSpinDelay(search !== deferredSearch)
	return h(
		Fragment,
		null,
		h(
			'div',
			null,
			h('input', {
				placeholder: 'Filter ships...',
				type: 'search',
				value: search,
				onChange: event => {
					setSearch(event.currentTarget.value)
				},
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
				{ style: { opacity: isPending ? 0.6 : 1 } },
				h(
					Suspense,
					{ fallback: h(SearchResultsFallback) },
					h(SearchResults, { search: deferredSearch, onSelection }),
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
function SearchResults({ search, onSelection }) {
	const shipResults = use(searchShips(search))
	return shipResults.ships.map(ship =>
		h(
			'li',
			{ key: ship.name },
			h(
				'button',
				{ onClick: () => onSelection(ship.name) },
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

function ShipDetails({ shipName }) {
	const shipImgSrc = getImageUrlForShip(shipName, {
		size: 200,
	})
	imgSrc(shipImgSrc)
	const ship = use(getShip(shipName))
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

function ShipFallback({ shipName }) {
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

function ShipError({ shipName }) {
	return h(
		'div',
		{ className: 'ship-info' },
		h(
			'div',
			{ className: 'ship-info__img-wrapper' },
			h(ShipImg, { src: '/img/broken-ship.webp', alt: 'broken ship' }),
		),
		h('section', null, h('h2', null, 'There was an error')),
		h('section', null, 'There was an error loading "', shipName, '"'),
	)
}

function ShipImg(props) {
	return h(
		ErrorBoundary,
		{ fallback: h('img', props), key: props.src },
		h(
			Suspense,
			{ fallback: h('img', { ...props, src: shipFallbackSrc }) },
			h(Img, props),
		),
	)
}

function Img({ src = '', ...props }) {
	src = use(imgSrc(src))
	return h('img', {
		src: src,
		...props,
	})
}
