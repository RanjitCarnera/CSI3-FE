import { borderColor, primary, textContrast } from "@screens/skill-assessment/parts/mock/color";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import React from "react";

export const NumberProgressBar = ({ value, percentage }: { value: string; percentage: number }) => {
	const strokeWidth = "0.8rem";
	const trailColor = borderColor;
	const pathColor = primary;
	const textColor = textContrast;
	const width = "3.4rem";

	const customStyles = buildStyles({
		trailColor: trailColor?.hexValue(),
		pathColor: pathColor?.hexValue(),
		textColor: textColor?.hexValue(),
	});
	return (
		<CircularProgressbar
			value={percentage}
			styles={{
				...customStyles,
				root: {
					...customStyles.root,
					height: width,
					width,
					margin: "0.2rem",
					overflow: "visible",
				},
				path: {
					...customStyles.path,
					strokeWidth,
				},
				trail: {
					...customStyles.trail,
					strokeWidth,
				},
				text: {
					...customStyles.text,
					fontSize: "3rem",
					fontWeight: 700,
					transform: "translateY(3.5px)",
				},
			}}
			text={value}
		/>
	);
};
