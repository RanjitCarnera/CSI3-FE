import { editBinarySkillAssociationModal_SkillAssociationFragment$key } from "@relay/editBinarySkillAssociationModal_SkillAssociationFragment.graphql";
import { editBinarySkillAssociationModal_PersonFragment$key } from "@relay/editBinarySkillAssociationModal_PersonFragment.graphql";
import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form";
import { editBinarySkillAssociationModal_SkillFragment$key } from "@relay/editBinarySkillAssociationModal_SkillFragment.graphql";

export type EditBinarySkillAssociationModalProps = {
	skillAssociationFragmentRef: editBinarySkillAssociationModal_SkillAssociationFragment$key;
	personFragmentRef: editBinarySkillAssociationModal_PersonFragment$key;
	updatedValue: BinaryInput;
	isVisible: boolean;
	onHide: () => void;
	skillFragmentRef: editBinarySkillAssociationModal_SkillFragment$key;
};
