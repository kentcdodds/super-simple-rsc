'use client'

import {
	createElement as h,
	Fragment,
	Suspense,
	use,
	useTransition,
} from 'react'
import { ErrorBoundary } from './error-boundary.js'
import { getImageUrlForShip } from './utils.js'
import { ShipImg } from './img.js'
import { RefreshRootContext } from './refresh.js'

export function ShipSearch({ search, results, fallback }) {
	const refreshRoot = use(RefreshRootContext)
	const [isPending, startTransition] = useTransition()
	return h(
		Fragment,
		null,
		h('input', {
			placeholder: 'Filter ships...',
			type: 'search',
			defaultValue: search,
			onChange: e => {
				startTransition(() => {
					refreshRoot({ search: e.currentTarget.value })
				})
			},
		}),
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
				h(Suspense, { fallback }, results),
			),
		),
	)
}

export function SelectShipButton({ shipName, children }) {
	const refreshRoot = use(RefreshRootContext)
	const [isPending, startTransition] = useTransition()
	return h('button', {
		children,
		onClick: () =>
			startTransition(() => {
				refreshRoot({ shipName })
			}),
	})
}
