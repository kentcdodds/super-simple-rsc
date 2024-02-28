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

let state = {}
const serializedJsx = refresh()

function refresh() {
	const params = new URLSearchParams(state)
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

function Shell({ serializedJsx }) {
	const [root, setRoot] = useState(use(serializedJsx))
	updateRoot = setRoot
	return root
}

ReactDOM.hydrateRoot(
	document,
	h(
		RefreshRootContext.Provider,
		{
			value: async updates => {
				state = { ...state, ...updates }
				const updatedData = await refresh()
				startTransition(() => {
					updateRoot(updatedData)
				})
			},
		},
		h(Shell, { serializedJsx }),
	),
)
