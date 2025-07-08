import { Icon } from "@thekeytechnology/framework-react-components";
import { generateTooltip } from "@screens/skill-assessment-execution/parts/category-form/category-form.util";
import React from "react";
import { useFragment } from "react-relay";
import { SKILL_FRAGMENT } from "@screens/people/parts/edit-person-skill-associations-modal-content/parts/numerical-skill-tooltip-icon/numerical-skill-tooltip-icon.graphql";
import { numericalSkillTooltipIcon_SkillFragment$key } from "@relay/numericalSkillTooltipIcon_SkillFragment.graphql";
import { NumericalSkillTooltipIconProps } from "@screens/people/parts/edit-person-skill-associations-modal-content/parts/numerical-skill-tooltip-icon/numerical-skill-tooltip-icon.types";

export const NumericalSkillTooltipIcon = ({ skillFragmentRef }: NumericalSkillTooltipIconProps) => {
	const skill = useFragment<numericalSkillTooltipIcon_SkillFragment$key>(
		SKILL_FRAGMENT,
		skillFragmentRef,
	);
	return (
		<Icon
			id={"my-id"}
			icon={"information-circle"}
			tooltipOptions={{
				content: generateTooltip([...(skill.dimension.dimensionExplanations ?? [])]),
				position: "bottom",
			}}
		/>
	);
};
