/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = function override(config) {
	config.resolve.alias = {
		...config.resolve.alias,
		"@relay": path.resolve(__dirname, "src/__generated__"),
		"@components": path.resolve(__dirname, "src/components"),
		"@assets": path.resolve(__dirname, "src/assets"),
		"@icons": path.resolve(__dirname, "src/core-style/icons"),
		"@typography": path.resolve(__dirname, "src/core-style/typography"),
		"@utils": path.resolve(__dirname, "src/utils"),
		"@screens": path.resolve(__dirname, "src/screens"),
		"@redux": path.resolve(__dirname, "src/redux"),
		"@corestyle": path.resolve(__dirname, "src/core-style"),
		"@i18n": path.resolve(__dirname, "src/i18n"),
	};
	return config;
};
