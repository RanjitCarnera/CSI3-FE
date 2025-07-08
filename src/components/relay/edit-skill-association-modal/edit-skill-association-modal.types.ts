import { editSkillAssociationModal_PersonFragment$key } from "@relay/editSkillAssociationModal_PersonFragment.graphql";
import { editSkillAssociationModal_SkillAssociationFragment$key } from "@relay/editSkillAssociationModal_SkillAssociationFragment.graphql";
import { SkillAssociationValueChangeStatus } from "@components/relay/edit-skill-association-modal/edit-skill-association-modal.util";
import {
	BinaryAssessmentValueInput,
	NumericalAssessmentValueInput,
} from "@relay/skillAssessmentExecution_AnswerAssessmentMutation.graphql";
import { editSkillAssociationModal_SkillFragment$key } from "@relay/editSkillAssociationModal_SkillFragment.graphql";

export type EditSkillAssociationModalProps = {
	skillAssociationFragmentRef: editSkillAssociationModal_SkillAssociationFragment$key;
	personFragmentRef: editSkillAssociationModal_PersonFragment$key;
	updatedValue: NumericalAssessmentValueInput | BinaryAssessmentValueInput;
	isVisible: boolean;
	onHide: () => void;
	skillFragmentRef: editSkillAssociationModal_SkillFragment$key;
};

export type StatusMap<T> = Record<SkillAssociationValueChangeStatus, T>;
