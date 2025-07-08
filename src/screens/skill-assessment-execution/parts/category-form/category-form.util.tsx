import React from "react";
import {
	TooltipDelimiter,
	TooltipIndex,
	TooltipItemWrapper,
	TooltipWrapper,
} from "@screens/skill-assessment-execution/parts/category-form/category-form.styles";

export const generateTooltip = (dimensionExplanations: string[]) => {
	const noExplanations = !dimensionExplanations.length;
	const explanationsAreEmpty = !dimensionExplanations.filter(Boolean).length;
	const needsContent = !(noExplanations || explanationsAreEmpty);
	const content = (
		<TooltipWrapper>
			{dimensionExplanations.filter(Boolean)?.map((e, i) => (
				<TooltipItemWrapper>
					<TooltipIndex>{i + 1}</TooltipIndex> <TooltipDelimiter>-</TooltipDelimiter>
					{e}
				</TooltipItemWrapper>
			))}
		</TooltipWrapper>
	);
	const fallback = (
		<TooltipWrapper>
			<TooltipItemWrapper>No tooltip available.</TooltipItemWrapper>
		</TooltipWrapper>
	);
	return needsContent ? content : fallback;
};
