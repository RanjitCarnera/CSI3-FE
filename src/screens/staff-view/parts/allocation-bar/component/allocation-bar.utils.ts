import shader from "shader";
import type { IntervalType } from "@relay/staffViewPart_Query.graphql";
import { hexToRgb } from "@utils/color-conversion";

export const getTextColorFromCustomBackgroundColor = (hex?: string): "#ffffff" | "#000000" => {
	if (!hex) return "#000000";
	const rgb = hexToRgb(hex);
	const black = "#000000";
	const white = "#ffffff";

	if (!rgb) return black;
	const contrastRatio = rgb?.r * 0.299 + rgb.g * 0.587 + rgb?.b * 0.114;
	return contrastRatio > 186 ? black : white;
};

export const getSecondaryTextColorFromCustomBackGroundColor = (hex?: string): string => {
	const blackOrWhite = getTextColorFromCustomBackgroundColor(hex);
	const isBlack = blackOrWhite === "#000000";
	const delta = isBlack ? 0.1 : -0.1;
	return shader(blackOrWhite, delta);
};

export function getInterval(date: Date, intervalType: IntervalType = "Weeks"): number {
	const today = new Date();

	if (
		today.getDate() === date.getDate() &&
		today.getMonth() === date.getMonth() &&
		today.getFullYear() === date.getFullYear()
	) {
		return 0;
	}

	const timeDiff = date.getTime() - today.getTime();
	let intervalAmount = 0;
	if (intervalType === "Weeks") {
		intervalAmount = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)); // Calculate the number of weeks
	} else if (intervalType === "Months") {
		const monthsDiff =
			(date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth()); // Calculate the number of months
		intervalAmount = Math.floor(monthsDiff);
	} else if (intervalType === "Quarters") {
		const quartersDiff =
			(date.getFullYear() - today.getFullYear()) * 4 +
			Math.floor((date.getMonth() - today.getMonth()) / 3); // Calculate the number of quarters
		intervalAmount = Math.floor(quartersDiff);
	}
	return intervalAmount;
}
