import type { Chart, Plugin } from "chart.js";

/**
 * Creates a linear graph at yValue
 * Used to show utilization caps
 * @param yValue
 */
export const createYLinePlugin = (yValue: number): Plugin<"line"> => ({
	id: "yLinePlugin",
	beforeDatasetsDraw(chart: Chart) {
		const {
			ctx,
			chartArea: { left, right, top, bottom },
			scales,
		} = chart;
		const yScale = scales.y;
		const y75 = yScale.getPixelForValue(yValue);

		ctx.save();
		ctx.strokeStyle = "orange";
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(left, y75);
		ctx.lineTo(right, y75);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();
	},
});
