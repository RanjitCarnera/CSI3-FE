import React from "react";
import { Line } from "react-chartjs-2";
import {
	BACKGROUND_COLOR,
	baseOptions,
	BORDER_COLOR,
} from "@components/cuc-field/cuc-field.consts";
import { type MarkerInput } from "@components/cuc-field/cuc-field.types";
import { createInitialData } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.utils";

export const CucPreview = ({
	width = "200px",
	height = "100px",
	cuc,
	borderColor = BORDER_COLOR,
	backgroundColor = BACKGROUND_COLOR,
	name = "CUC",
}: {
	width?: string;
	height?: string;
	cuc: MarkerInput[];
	backgroundColor?: string;
	borderColor?: string;
	name?: string;
}) => {
	return (
		<div style={{ width, height }}>
			<Line
				options={{
					...baseOptions,
					plugins: { title: {} },
					scales: {
						x: {
							dragData: false,
							type: "linear",
							suggestedMin: 0,
							suggestedMax: 100,
						},
						y: {
							dragData: false,
							suggestedMax: 150,
							beginAtZero: true,
						},
					},
				}}
				data={createInitialData(name, cuc, borderColor, backgroundColor)}
				plugins={[]}
			/>
		</div>
	);
};
