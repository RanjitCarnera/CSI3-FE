import type { ChartOptions } from "chart.js";
import * as Yup from "yup";
import type { MarkerInput } from "@components/cuc-field/cuc-field.types";

/**
 * Show bottom and top cap for utilization inside chart.
 */
export const SHOW_CAPS = true;

export const BORDER_COLOR = "rgb(255, 99, 132)";
export const BACKGROUND_COLOR = "rgba(255, 99, 132, 0.5)";

export const HIGHLIGHT_BORDER_COLOR = "rgb(0, 200, 140)";
export const HIGHLIGHT_BACKGROUND_COLOR = "rgba(0, 200, 140, 0.5)";

export const cucFormValidation = Yup.array()
	.optional()
	.min(2, "The CUC needs at least 2 markers.")
	.test(
		"ascending-percentageTime",
		"Each point in time must be greater than it's predecessor.",
		function (entries: MarkerInput[] | undefined) {
			if (!entries) return true;
			for (let i = 0; i < entries.length - 1; i++) {
				if (entries[i].percentageTime > entries[i + 1].percentageTime) {
					return false;
				}
			}
			return true;
		},
	);

export const baseOptions: ChartOptions<"line"> = {
	responsive: true,
	maintainAspectRatio: false,
	interaction: {
		intersect: false,
		mode: "x",
	},
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "CUC - Custom utilization curve",
		},
		subtitle: {
			display: true,
			position: "top",
			text: "Right click anywhere on the chart to add a marker. Right click on new markers for more options.",
		},
	},
	scales: {
		x: {
			dragData: true,
			type: "linear",
			min: 0,
			max: 10,
		},
		y: {
			dragData: true,
			suggestedMax: 150,
			beginAtZero: true,
		},
	},
};

/**
 * Chart pan options.
 */
export const MAX = {
	Y_MIN: 0,
	Y_MAX: 300,
	X_MIN: -100,
	X_MAX: 200,
};

/**
 * Default markers for when cuc field is empty.
 * Defaults to a linear 100% weight over 100% of time.
 */
export const DEFAULT_CUC_FIELD_MARKERS: MarkerInput[] = [
	{
		kind: "CustomMarker",
		percentageTime: 0,
		percentageWeight: 100,
		name: "Start",
	},
	{
		kind: "CustomMarker",
		percentageTime: 100,
		percentageWeight: 100,
		name: "Finish",
	},
];
