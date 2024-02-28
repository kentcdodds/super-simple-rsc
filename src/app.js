import * as React from 'react'
import { App as ClientApp } from './app.client.js'

const h = React.createElement

export async function App() {
	return h(
		'html',
		{
			lang: 'en',
		},
		h(
			'head',
			null,
			h('meta', { charSet: 'utf-8' }),
			h('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			}),
			h('title', null, 'Super Simple RSC'),
			h('link', { rel: 'stylesheet', href: '/src/style.css' }),
		),
		h('body', null, h(ClientApp)),
	)
}
