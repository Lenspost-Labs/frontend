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
			keyframes: {
				sparkle: {
					'0%': {
						opacity: 0,
						transform: 'rotate(0deg) translate(12px, 0) scale(0)',
					},
					'50%': {
						opacity: 1,
						transform: 'rotate(180deg) translate(12px, 0) scale(1)',
					},
					'100%': {
						opacity: 0,
						transform: 'rotate(360deg) translate(12px, 0) scale(0)',
					},
				},
				'bounce-spin': {
					'0%, 100%': {
						transform: 'translateY(0) rotate(0deg)',
					},
					'50%': {
						transform: 'translateY(-25%) rotate(15deg)',
					},
				},
			},
			animation: {
				'sparkle-1': 'sparkle 2s linear infinite',
				'sparkle-2': 'sparkle 2s linear infinite 0.3s',
				'sparkle-3': 'sparkle 2s linear infinite 0.6s',
				'sparkle-4': 'sparkle 2s linear infinite 0.9s',
				'sparkle-5': 'sparkle 2s linear infinite 1.2s',
				'sparkle-6': 'sparkle 2s linear infinite 1.5s',
				'bounce-spin': 'bounce-spin 1s ease-in-out infinite',
			},
		},
	},
})
