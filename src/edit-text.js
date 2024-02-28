'use client'

import { createElement as h, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

const inheritStyles = {
	fontSize: 'inherit',
	fontStyle: 'inherit',
	fontWeight: 'inherit',
	fontFamily: 'inherit',
	textAlign: 'inherit',
}

export function EditableText({
	id,
	initialValue = '',
	fieldName,
	inputLabel,
	buttonLabel,
}) {
	const [edit, setEdit] = useState(false)
	const [value, setValue] = useState(initialValue)
	const inputRef = useRef(null)
	const buttonRef = useRef(null)
	return edit
		? h(
				'form',
				{
					method: 'post',
					onSubmit: event => {
						event.preventDefault()
						flushSync(() => {
							setValue(inputRef.current?.value ?? '')
							setEdit(false)
						})
						buttonRef.current?.focus()
					},
				},
				h('input', {
					required: true,
					ref: inputRef,
					type: 'text',
					id: id,
					'aria-label': inputLabel,
					name: fieldName,
					defaultValue: value,
					style: {
						border: 'none',
						background: 'none',
						...inheritStyles,
					},
					onKeyDown: event => {
						if (event.key === 'Escape') {
							flushSync(() => {
								setEdit(false)
							})
							buttonRef.current?.focus()
						}
					},
					onBlur: event => {
						flushSync(() => {
							setValue(event.currentTarget.value)
							setEdit(false)
						})
						buttonRef.current?.focus()
					},
				}),
			)
		: h(
				'button',
				{
					'aria-label': buttonLabel,
					ref: buttonRef,
					type: 'button',
					style: {
						border: 'none',
						background: 'none',
						...inheritStyles,
					},
					onClick: () => {
						flushSync(() => {
							setEdit(true)
						})
						inputRef.current?.select()
					},
				},
				value || 'Edit',
			)
}
