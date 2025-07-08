import { editSkillAssociationModal_SkillAssociationFragment$key } from "@relay/editSkillAssociationModal_SkillAssociationFragment.graphql";
import { editSkillAssociationModal_PersonFragment$key } from "@relay/editSkillAssociationModal_PersonFragment.graphql";
import { editSkillAssociationModal_SkillFragment$key } from "@relay/editSkillAssociationModal_SkillFragment.graphql";

export type RangeFormProps = {
	value?: number;
	dimensionCount: number;
	dimensionExplanations: string[];
	onChange?: (i: number) => void;
};

export type RangeFormSmProps = RangeFormProps & {
	skillAssociationFragmentRef: editSkillAssociationModal_SkillAssociationFragment$key;
	personFragmentRef: editSkillAssociationModal_PersonFragment$key;
	skillFragmentRef: editSkillAssociationModal_SkillFragment$key;
};
