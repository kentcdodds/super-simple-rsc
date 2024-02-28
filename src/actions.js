import * as db from '../db/ship-api'

export async function createShip() {
	await db.createShip()
	return 'success'
}
