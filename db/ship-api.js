import shipData from './ships.json' assert { type: 'json' }

const formatDate = date =>
	`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
		date.getSeconds(),
	).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

export async function searchShips({
	query,
	delay = Math.random() * 200 + 300,
}) {
	const endTime = Date.now() + delay
	const ships = shipData
		.filter(ship => ship.name.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 13)
	await new Promise(resolve => setTimeout(resolve, endTime - Date.now()))
	return {
		ships: ships.map(ship => ({ name: ship.name })),
		fetchedAt: formatDate(new Date()),
	}
}

export async function getShip({ name, delay = Math.random() * 200 + 300 }) {
	const endTime = Date.now() + delay
	if (!name) {
		throw new Error('No name provided')
	}
	const ship = shipData.find(
		ship => ship.name.toLowerCase() === name.toLowerCase(),
	)
	await new Promise(resolve => setTimeout(resolve, endTime - Date.now()))
	if (!ship) {
		throw new Error(`No ship with the name "${name}"`)
	}
	return {
		...ship,
		fetchedAt: 'TODO', // formatDate(new Date())
	}
}

export async function createShip() {
	shipData.push({
		name: 'New Ship',
	})
}
