/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT'

export default withMT({
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		colors: {
			lenspostLime: '#e1f16b',
			lenspostPurple: '#2C346B',
			lenspostPink: '#E598D8',
			lenspostBlack: '#272727',
			lenspostYellow: '#FFF559',
			lenspostCyan: '#A0F8EE',
		},
		extend: {
			screens: {
				sm: '500px',
			},
		},
	},
})
