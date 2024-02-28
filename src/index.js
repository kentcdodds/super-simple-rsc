import {
	createElement as h,
	use,
	Suspense,
	useState,
	startTransition,
} from 'react'
import ReactDOM from 'react-dom/client'
import { createFromFetch, encodeReply } from 'react-server-dom-esm/client'
import { RefreshRootContext } from './refresh.js'

const moduleBaseURL = '/src'
let updateRoot
async function callServer(id, args) {
	const response = fetch('/', {
		method: 'POST',
		headers: {
			Accept: 'text/x-component',
			'rsc-action': id,
		},
		body: await encodeReply(args),
	})
	const { returnValue, root } = await createFromFetch(response, {
		callServer,
		moduleBaseURL,
	})
	// Refresh the tree with the new RSC payload.
	startTransition(() => {
		updateRoot(root)
	})
	return returnValue
}

const data = refresh()

function refresh({ search, shipName } = {}) {
	const params = new URLSearchParams()
	if (search) params.set('search', search)
	if (shipName) params.set('shipName', shipName)
	return createFromFetch(
		fetch(`/?${params}`, {
			headers: {
				Accept: 'text/x-component',
			},
		}),
		{
			callServer,
			moduleBaseURL,
		},
	)
}

function Shell({ data }) {
	const [root, setRoot] = useState(use(data))
	updateRoot = setRoot
	return root
}

ReactDOM.hydrateRoot(
	document,
	h(
		RefreshRootContext.Provider,
		{
			value: async ({ search }) => {
				const updatedData = await refresh({ search })
				startTransition(() => {
					updateRoot(updatedData)
				})
			},
		},
		h(Shell, { data }),
	),
)
