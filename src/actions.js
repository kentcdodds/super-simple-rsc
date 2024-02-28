'use server'

import { setServerState } from './server-state.js'

export async function like() {
	setServerState('Liked!')
	return new Promise((resolve, reject) => resolve('Liked'))
}

export async function greet(formData) {
	const name = formData.get('name') || 'you'
	setServerState('Hi ' + name)
	const file = formData.get('file')
	if (file) {
		const fileText = (await file.text()).toUpperCase()
		return `Ok, ${name}, here is ${file.name}: ${fileText}`
	}
	return 'Hi ' + name + '!'
}
