import type { ChartData } from "chart.js";
import { type RefObject } from "react";
import { type ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import {
	HIGHLIGHT_BACKGROUND_COLOR,
	HIGHLIGHT_BORDER_COLOR,
} from "@components/cuc-field/cuc-field.consts";
import type { ChartDataValue, MarkerInput } from "@components/cuc-field/cuc-field.types";

/**
 * Extracts the data from the chart ref.
 * @param chartRef
 * @returns The data from the chart.
 */
export const extractDataFromChartRef = (
	chartRef: RefObject<ChartJSOrUndefined>,
): ChartDataValue[] | null => {
	const chart = chartRef.current;
	const canvas = chart?.canvas;
	if (!canvas || !chart) return null;

	const dataset = chart.data.datasets[0];
	return dataset.data as ChartDataValue[];
};

type ResolveFn<T> = (t: T) => number;
/**
 * Get previous index of an array.
 * @param arr array
 * @param resolveFn resolve to comparable number
 * @param comparisonValue comparing resolveFn(value) to comparisonValue
 * @returns index of the previous value
 */
export const getPrevIndex = <T>(
	arr: T[],
	resolveFn: ResolveFn<T>,
	comparisonValue: number,
): number => {
	const mapped = arr.slice().sort((a, b) => resolveFn(b) - resolveFn(a));
	const indexOfMapped = mapped.findIndex((value) => resolveFn(value) < comparisonValue);
	return arr.indexOf(mapped[indexOfMapped]);
};

// TODO: Testing
// const assert = (a: any,b: any) => {
// 	if(a !== b) console.log(`Expected ${a} but got ${b}`)
// 	else console.log(`${a} is ${b}`)
// }
//
// const arr = [{label:"aaa",value:2}, {label:"bbb", value: 3}, {label:"ccc", value: 4}, {label:"ddd", value: 4.6}];
//
// assert(getPrevIndex(arr, e => e.value, 4.6), 2)
// assert(getPrevIndex(arr, e => e.value, 4.5), 2)
// assert(getPrevIndex(arr, e => e.value, 3.5), 1)
// assert(getPrevIndex(arr, e => e.value, 2.5), 0)
// assert(getPrevIndex(arr, e => e.value, 0.5), 0)

export const createInitialData = (
	dataSetLabel: string,
	values: MarkerInput[],
	borderColor: string,
	backgroundColor: string,
): ChartData<"line", ChartDataValue[]> => ({
	datasets: [
		{
			label: dataSetLabel,
			data:
				values?.map((e) => ({
					...e,
					x: e.percentageTime,
					y: e.percentageWeight,
				})) ?? [],
			borderColor: (ctx) => {
				const value = ctx.raw as ChartDataValue | undefined;
				if (!value) return borderColor;
				return value.kind === "MilestoneMarker" ? HIGHLIGHT_BORDER_COLOR : borderColor;
			},
			backgroundColor: (ctx) => {
				const value = ctx.raw as ChartDataValue | undefined;
				if (!value) return backgroundColor;
				return value.kind === "MilestoneMarker"
					? HIGHLIGHT_BACKGROUND_COLOR
					: backgroundColor;
			},
			stepped: true,
			pointStyle: "circle",
			pointRadius: 5,
			pointHoverRadius: 10,
		},
	],
});
