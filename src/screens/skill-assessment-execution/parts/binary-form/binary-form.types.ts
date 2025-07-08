import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form/binary-form.component";
import { editSkillAssociationModal_SkillAssociationFragment$key } from "@relay/editSkillAssociationModal_SkillAssociationFragment.graphql";
import { editSkillAssociationModal_PersonFragment$key } from "@relay/editSkillAssociationModal_PersonFragment.graphql";
import { editSkillAssociationModal_SkillFragment$key } from "@relay/editSkillAssociationModal_SkillFragment.graphql";

export type BinaryFormProps = {
	value?: BinaryInput;
	onChange?: (input: BinaryInput) => void;
};
export type BinaryFormSmProps = BinaryFormProps & {
	skillAssociationFragmentRef: editSkillAssociationModal_SkillAssociationFragment$key;
	personFragmentRef: editSkillAssociationModal_PersonFragment$key;
	skillFragmentRef: editSkillAssociationModal_SkillFragment$key;
};
