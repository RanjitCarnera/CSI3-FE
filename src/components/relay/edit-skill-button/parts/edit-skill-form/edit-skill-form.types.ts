import { SkillDimensionTypeEnum } from "@relay/categoryForm_SkillFragment.graphql";

export type EditSkillButtonFormState = {
	name?: string;
	description?: string;
	skillCategoryRef?: string;
	dimension?: SkillDimensionTypeEnum;
	dimensionCount: number;
	dimensionExplanations: string[];
};
