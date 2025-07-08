import {
	SkillDimensionTypeEnum,
	skillsDisplay_SkillAssociationInlineFragment$data,
} from "@relay/skillsDisplay_SkillAssociationInlineFragment.graphql";
import {
	SkillValueWrapper,
	YesOrNoWrapper,
} from "@components/person-details-button/parts/person-details-control/parts/skills-display/skills-display.styles";
import {
	PersonDetailsModalDimensionCountTypographySpan,
	PersonDetailsModalSpan,
} from "@screens/skill-assessment/parts/mock/typography";
import { primary, textContrast, textSubtle } from "@screens/skill-assessment/parts/mock/color";
import React from "react";

export function formatAssessmentValue({
	kind,
	hasSkill,
	number,
}: {
	kind?: SkillDimensionTypeEnum;
	hasSkill?: boolean;
	number?: number;
}) {
	return kind === "binary"
		? hasSkill === true
			? "Y"
			: hasSkill === false
			? "N"
			: "N/A"
		: kind === "numerical"
		? number
		: "N/A";
}
export const skillAssociationToFormattedJsx = (
	skillAssociation: skillsDisplay_SkillAssociationInlineFragment$data,
) => {
	return skillAssociation.data.value.kind === "numerical" ? (
		<SkillValueWrapper>
			<PersonDetailsModalSpan color={textContrast}>
				{skillAssociation.data.value.number}
			</PersonDetailsModalSpan>
			<PersonDetailsModalDimensionCountTypographySpan color={textSubtle}>
				/{skillAssociation.data.skill?.dimension.dimensionCount}
			</PersonDetailsModalDimensionCountTypographySpan>
		</SkillValueWrapper>
	) : skillAssociation.data.value.kind === "binary" ? (
		<YesOrNoWrapper>
			<PersonDetailsModalSpan
				color={skillAssociation.data.value.hasSkill ? primary : textContrast}
			>
				{skillAssociation.data.value.hasSkill ? "Y" : "N"}
			</PersonDetailsModalSpan>
		</YesOrNoWrapper>
	) : (
		<React.Fragment />
	);
};
export const calculatePointsInCategory = (
	arr: skillsDisplay_SkillAssociationInlineFragment$data[],
) => {
	const points = arr.reduce((prev, curr) => {
		const point =
			curr.data.value.kind === "binary"
				? curr.data.value.hasSkill
					? 1
					: 0
				: curr.data.value.kind === "numerical"
				? curr.data.value.number ?? 0
				: 0;
		return prev + point;
	}, 0);
	return points;
};

export const calculateMaxPointsInCategory = (
	arr: skillsDisplay_SkillAssociationInlineFragment$data[],
) => {
	const max = arr.reduce((prev, curr) => {
		const kind = curr.data.skill?.dimension.kind;
		if (!kind) return prev + 0;

		if (kind === "binary") return prev + 1;
		else if (kind === "numerical")
			return prev + (curr.data.skill?.dimension.dimensionCount ?? 0);
		return prev + 0;
	}, 0);

	return max;
};
