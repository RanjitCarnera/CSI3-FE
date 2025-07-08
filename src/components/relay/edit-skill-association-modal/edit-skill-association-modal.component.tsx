import React from "react";
import { useFragment } from "react-relay";
import {
	PERSON_FRAGMENT,
	SKILL_ASSOCIATION_FRAGMENT,
	SKILL_FRAGMENT,
} from "@components/relay/edit-skill-association-modal/edit-skill-association-modal.graphql";
import { EditBinarySkillAssociationModal } from "@components/relay/edit-skill-association-modal/parts/edit-binary-skill-association-modal/edit-binary-skill-association-modal.component";
import { EditNumericalSkillAssociationModal } from "@components/relay/edit-skill-association-modal/parts/edit-numerical-skill-association-modal";
import { type editSkillAssociationModal_PersonFragment$key } from "@relay/editSkillAssociationModal_PersonFragment.graphql";
import {
	type editSkillAssociationModal_SkillAssociationFragment$key,
	type SkillDimensionTypeEnum,
} from "@relay/editSkillAssociationModal_SkillAssociationFragment.graphql";

import { type editSkillAssociationModal_SkillFragment$key } from "@relay/editSkillAssociationModal_SkillFragment.graphql";
import {
	type BinaryAssessmentValueInput,
	type NumericalAssessmentValueInput,
} from "@relay/skillAssessmentExecution_AnswerAssessmentMutation.graphql";
import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form";
import { type EditSkillAssociationModalProps } from "./edit-skill-association-modal.types";

export const EditSkillAssociationModal = ({
	skillAssociationFragmentRef,
	personFragmentRef,
	updatedValue,
	isVisible,
	onHide,
	skillFragmentRef,
	...props
}: EditSkillAssociationModalProps) => {
	const person = useFragment<editSkillAssociationModal_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const skillAssociation = useFragment<editSkillAssociationModal_SkillAssociationFragment$key>(
		SKILL_ASSOCIATION_FRAGMENT,
		skillAssociationFragmentRef,
	);
	const skill = useFragment<editSkillAssociationModal_SkillFragment$key>(
		SKILL_FRAGMENT,
		skillFragmentRef,
	);

	const map: Record<SkillDimensionTypeEnum, () => JSX.Element> = {
		binary: () => (
			<EditBinarySkillAssociationModal
				isVisible={isVisible}
				onHide={onHide}
				personFragmentRef={person}
				skillAssociationFragmentRef={skillAssociation}
				skillFragmentRef={skill}
				updatedValue={
					(updatedValue as BinaryAssessmentValueInput).hasSkill
						? BinaryInput.yes
						: BinaryInput.no
				}
			/>
		),
		numerical: () => (
			<EditNumericalSkillAssociationModal
				isVisible={isVisible}
				onHide={onHide}
				personFragmentRef={person}
				skillAssociationFragmentRef={skillAssociation}
				skillFragmentRef={skill}
				updatedValue={(updatedValue as NumericalAssessmentValueInput).number}
			/>
		),
	};
	const kind = skillAssociation?.data?.skill?.dimension?.kind ?? skill?.dimension?.kind;

	if (!kind) return <React.Fragment />;
	const Element = map[kind];
	return <Element />;
};
