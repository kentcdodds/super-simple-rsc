const shipCache = new Map()

export function getShip(name, delay) {
	const shipPromise = shipCache.get(name) ?? getShipImpl(name, delay)
	shipCache.set(name, shipPromise)
	return shipPromise
}

async function getShipImpl(name, delay) {
	const searchParams = new URLSearchParams({ name })
	if (delay) searchParams.set('delay', String(delay))
	const response = await fetch(
		`http://localhost:3001/api/get-ship?${searchParams.toString()}`,
	)
	if (!response.ok) {
		return Promise.reject(new Error(await response.text()))
	}
	const ship = await response.json()
	return ship
}

const shipSearchCache = new Map()

export function searchShips(query, delay) {
	const searchPromise =
		shipSearchCache.get(query) ?? searchShipImpl(query, delay)
	shipSearchCache.set(query, searchPromise)
	return searchPromise
}

async function searchShipImpl(query, delay) {
	const searchParams = new URLSearchParams({ query })
	if (delay) searchParams.set('delay', String(delay))
	const response = await fetch(
		`http://localhost:3001/api/search-ships?${searchParams.toString()}`,
	)
	if (!response.ok) {
		return Promise.reject(new Error(await response.text()))
	}
	const ship = await response.json()
	return ship
}

const imgCache = new Map()

export function imgSrc(src) {
	const imgPromise = imgCache.get(src) ?? preloadImage(src)
	imgCache.set(src, imgPromise)
	return imgPromise
}

function preloadImage(src) {
	if (typeof document === 'undefined') {
		return Promise.resolve(src)
	}
	return new Promise(async (resolve, reject) => {
		const img = new Image()
		img.src = src
		img.onload = () => resolve(src)
		img.onerror = reject
	})
}

export function getImageUrlForShip(shipName, { size }) {
	return `/img/ships/${shipName
		.toLowerCase()
		.replaceAll(' ', '-')}.webp?size=${size}`
}
