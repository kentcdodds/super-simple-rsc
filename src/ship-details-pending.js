'use client'

import { createElement as h, createContext, use } from 'react'

export const ShipDetailsPendingContext = createContext()

export function ShipDetailsPendingTransition({ children }) {
	const isPending = use(ShipDetailsPendingContext)
	return h('div', {
		className: 'details',
		style: { opacity: isPending ? 0.6 : 1 },
		children,
	})
}
