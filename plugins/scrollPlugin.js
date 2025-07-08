module.exports = function scrollPlugin({ addComponents }) {
	const classes = {
		".no-scrollbar::-webkit-scrollbar": {
			display: "none",
		},
		".no-scrollbar": {
			"-ms-overflow-style": "none" /* IE and Edge */,
			"scrollbar-width": "none" /* Firefox */,
		},
		// ...
	};
	addComponents(classes);
};
