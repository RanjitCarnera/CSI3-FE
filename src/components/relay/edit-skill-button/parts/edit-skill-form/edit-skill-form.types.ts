import { type SkillDimensionTypeEnum } from "@relay/categoryForm_SkillFragment.graphql";

export interface EditSkillButtonFormState {
	name?: string;
	description?: string;
	skillCategoryRef?: string;
	dimension?: SkillDimensionTypeEnum;
	dimensionCount: number;
	dimensionExplanations: string[];
}
