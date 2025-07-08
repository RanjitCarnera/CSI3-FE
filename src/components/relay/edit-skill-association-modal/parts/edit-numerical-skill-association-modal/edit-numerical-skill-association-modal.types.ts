import { editNumericalSkillAssociationModal_SkillAssociationFragment$key } from "@relay/editNumericalSkillAssociationModal_SkillAssociationFragment.graphql";
import { editNumericalSkillAssociationModal_PersonFragment$key } from "@relay/editNumericalSkillAssociationModal_PersonFragment.graphql";
import { editNumericalSkillAssociationModal_SkillFragment$key } from "@relay/editNumericalSkillAssociationModal_SkillFragment.graphql";

export type EditNumericalSkillAssociationModalProps = {
	skillAssociationFragmentRef: editNumericalSkillAssociationModal_SkillAssociationFragment$key;
	personFragmentRef: editNumericalSkillAssociationModal_PersonFragment$key;
	updatedValue: number;
	isVisible: boolean;
	onHide: () => void;
	skillFragmentRef: editNumericalSkillAssociationModal_SkillFragment$key;
};
