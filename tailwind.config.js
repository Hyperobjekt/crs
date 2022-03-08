module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
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
				"accent-blue": "#3EA2ED",
				"accent-purple": "#5B5D84",
				"accent-orange": "#C66E3B",
			},
			fontSize: {
				"sm": [12, "14px"],
				"md": [14, "17px"],
				"lg": [15, "20px"],
				"xl": [18, "23px"],
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