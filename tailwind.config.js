module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {

				"primary": "#99ABB0",
				"secondary": "#D4DFE3",

				"accent-blue": "#3EA2ED",
				"accent-purple": "#5B5D84",
				"accent-orange": "#C66E3B",

				// "text-primary": "#393B3D",
				// "text-secondary": "#72746D",
				// "text-light": "#A5ACB2",

				// "bg-default": "#F7FAFB",
				// "bg-paper": "#FFFFFF",
				// "bg-dark": "#1A212A",

				"gray-100": "#F9F9F9",
				"gray-200": "#EAEAEA",
				"gray-300": "#C7C7C7",
				"gray-400": "#949494",
				"gray-500": "#707375",
				"gray-600": "#4E5256",
				"gray-700": "#363A3E",
				"gray-blue-100": "#F7FAFB",
				"gray-blue-200": "#E6F0F3",
				"gray-blue-300": "#D4DFE3",
				"gray-blue-400": "#7E8D92",
				"dark-blue": "#326A96",

				"local-1": "#5B5D84",
				"local-2": "#C66E3B",

				"state-1": "#FCFCFF",
				"state-2": "#DEE2E4",
				"state-3": "#D4DFE3",

				"map-outline": "#99ABB0"
			},
			fontSize: {
				"sm": [12, "14px"],
				"md": [14, "17px"],
				"lg": [15, "20px"],
				"xl": [17, "23px"],
				"xxl": [20, "23px"],
			},
			boxShadow: {
				"DEFAULT": "0 0 10px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
			},
			borderColor: {
				"DEFAULT": "#EAEAEA",
			}
		},
	},
	plugins: [],
}