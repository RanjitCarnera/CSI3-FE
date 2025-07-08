import { type SkillDimensionTypeEnum } from "@relay/categoryForm_SkillFragment.graphql";

export interface SkillAssessmentExecutionProps {
	accountId: string;
	id: string;
	password?: string;
}

export type SkillAssessmentExecutionFormState = Record<
	string,
	{ kind?: SkillDimensionTypeEnum; hasSkill?: boolean; number?: number }
>;
