import { Select, Option } from '@material-tailwind/react'
import React from 'react'

const SelectBox = ({
	label,
	value,
	onChange,
	options,
	className,
	name,
	onFocus,
	onBlur,
	autoFocus,
	function: callbackFn, // renamed from 'funtion' to be more clear
}) => {
	const handleChange = (selectedValue) => {
		if (typeof onChange === 'function') {
			// Create an event-like object to maintain consistency with Input
			const event = {
				target: {
					name: name,
					value: selectedValue,
				},
			}
			onChange(event)
		}

		// Call additional callback if provided
		if (typeof callbackFn === 'function') {
			callbackFn(selectedValue)
		}
	}

	return (
		<Select
			className={className}
			label={label}
			onChange={handleChange}
			onFocus={onFocus}
			value={value}
			name={name}
			onBlur={onBlur}
			containerProps={{ className: 'min-w-[100px]' }}
			autoFocus={autoFocus}
		>
			{options?.map((option) => (
				<Option key={option.value} value={option.value}>
					{option.label}
				</Option>
			))}
		</Select>
	)
}

export default SelectBox
