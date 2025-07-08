import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { ProgressBarProps } from "@screens/skill-assessment-execution/parts/progress-bar/progress-bar.types";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import {
	DEFAULT_PATH_COLOR,
	DEFAULT_STROKE_WIDTH,
	DEFAULT_TEXT_COLOR,
	DEFAULT_TRAIL_COLOR,
} from "@screens/skill-assessment-execution/parts/progress-bar/progress-bar.consts";
import { isNumber } from "@screens/skill-assessment-execution/parts/progress-bar/progress-bar.util";

export const ProgressBar = ({
	strokeWidth = DEFAULT_STROKE_WIDTH,
	trailColor = DEFAULT_TRAIL_COLOR,
	pathColor = DEFAULT_PATH_COLOR,
	textColor = DEFAULT_TEXT_COLOR,
	...props
}: ProgressBarProps) => {
	const customStyles = buildStyles({
		trailColor: trailColor?.hexValue(),
		pathColor: pathColor?.hexValue(),
		textColor: textColor?.hexValue(),
	});
	const text = isNumber(props.value) ? props.value + "%" : "";
	return (
		<CircularProgressbar
			strokeWidth={strokeWidth}
			styles={{
				...customStyles,
				root: {
					...customStyles.root,
					height: "3.25rem",
					width: "3.25rem",
				},
				path: {
					...customStyles.path,
				},
				trail: {
					...customStyles.trail,
				},
				text: {
					...customStyles.text,
				},
			}}
			{...props}
			text={text}
		/>
	);
};
