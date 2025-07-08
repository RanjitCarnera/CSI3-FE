/** @type {import("tailwindcss").Config} */

const { scrollPlugin } = require("./plugins/scrollPlugin");
const { BreakpointInPx } = require("./src/core-style/breakpoints");

const {
	spacing4,
	spacing8,
	spacing12,
	spacing16,
	spacing20,
	spacing24,
	spacing32,
	spacing40,
	spacing64,
	spacing80,
	spacing96,
	spacing6,
} = require("./src/core-style/spacing");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
		spacing: {
			0: "0",
			4: spacing4.rem(),
			6: spacing6.rem(),
			8: spacing8.rem(),
			12: spacing12.rem(),
			16: spacing16.rem(),
			20: spacing20.rem(),
			24: spacing24.rem(),
			32: spacing32.rem(),
			40: spacing40.rem(),
			64: spacing64.rem(),
			80: spacing80.rem(),
			96: spacing96.rem(),
		},
		borderRadius: {
			8: "0.5rem",
			10: "0.625rem",
			20: "1.25rem",
			none: "0rem",
		},
		screens: {
			md: `${BreakpointInPx.medium}px`,
			lg: `${BreakpointInPx.large}px`,
			xl: `${BreakpointInPx.xlarge}px`,
			xxl: `${BreakpointInPx.xxlarge}px`,
		},
		colors: {},
	},
	plugins: [scrollPlugin],
};
