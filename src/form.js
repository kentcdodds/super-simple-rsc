'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { ErrorBoundary } from './error-boundary.js'

const h = React.createElement

function Status() {
	const { pending } = useFormStatus()
	return pending ? 'Saving...' : null
}

export function Form({ action, children }) {
	const [isPending, setIsPending] = React.useState(false)
	return h(
		ErrorBoundary,
		null,
		h(
			'form',
			{
				action: action,
			},
			h(
				'label',
				{},
				'Name: ',
				h('input', {
					name: 'name',
				}),
			),
			h(
				'label',
				{},
				'File: ',
				h('input', {
					type: 'file',
					name: 'file',
				}),
			),
			h('button', {}, 'Say Hi'),
			h(Status, {}),
		),
	)
}
