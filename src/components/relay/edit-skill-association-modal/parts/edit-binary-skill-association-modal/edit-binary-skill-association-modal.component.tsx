import { Button, Dialog, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React, { Suspense } from "react";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	buttonLabelMap,
	headerMap,
	inputVariantMap,
} from "@components/relay/edit-skill-association-modal/edit-skill-association-modal.consts";
import {
	calculateBinaryChangeStatus,
	getChangeText,
	SkillAssociationValueChangeStatus,
} from "@components/relay/edit-skill-association-modal/edit-skill-association-modal.util";
import {
	ASSOCIATE_SKILL_MUTATION,
	DISASSOCIATE_SKILL_MUTATION,
	PERSON_FRAGMENT,
	SKILL_ASSOCIATION_FRAGMENT,
	SKILL_FRAGMENT,
} from "@components/relay/edit-skill-association-modal/parts/edit-binary-skill-association-modal/edit-binary-skill-association-modal.graphql";
import {
	Flex1Wrapper,
	Wrapper,
} from "@components/relay/edit-skill-association-modal/parts/edit-binary-skill-association-modal/edit-binary-skill-association-modal.styles";
import { type EditBinarySkillAssociationModalProps } from "@components/relay/edit-skill-association-modal/parts/edit-binary-skill-association-modal/edit-binary-skill-association-modal.types";
import { Loader } from "@components/ui/Loader";
import { SkillAssessmentTheme } from "@corestyle/component-theme/component-theme";
import { type editBinarySkillAssociationModal_AssociateSkillMutation } from "@relay/editBinarySkillAssociationModal_AssociateSkillMutation.graphql";
import { type editBinarySkillAssociationModal_DisassociateSkillMutation } from "@relay/editBinarySkillAssociationModal_DisassociateSkillMutation.graphql";
import { type editBinarySkillAssociationModal_PersonFragment$key } from "@relay/editBinarySkillAssociationModal_PersonFragment.graphql";
import { type editBinarySkillAssociationModal_SkillAssociationFragment$key } from "@relay/editBinarySkillAssociationModal_SkillAssociationFragment.graphql";
import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form";

export const EditBinarySkillAssociationModal = ({
	skillAssociationFragmentRef,
	personFragmentRef,
	updatedValue,
	isVisible,
	onHide: handleOnHide,
	skillFragmentRef,
}: EditBinarySkillAssociationModalProps) => {
	const skill = useFragment(SKILL_FRAGMENT, skillFragmentRef);
	const personFragment = useFragment<editBinarySkillAssociationModal_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const skillAssociation =
		useFragment<editBinarySkillAssociationModal_SkillAssociationFragment$key>(
			SKILL_ASSOCIATION_FRAGMENT,
			skillAssociationFragmentRef,
		);

	const [associateSkill, isAssociating] =
		useMutation<editBinarySkillAssociationModal_AssociateSkillMutation>(
			ASSOCIATE_SKILL_MUTATION,
		);
	const [disassociateSkill, isDisassociating] =
		useMutation<editBinarySkillAssociationModal_DisassociateSkillMutation>(
			DISASSOCIATE_SKILL_MUTATION,
		);

	const changeStatus = calculateBinaryChangeStatus({
		previousHasSkill: skillAssociation?.data?.value?.hasSkill,
		updatedHasSkill: updatedValue === BinaryInput.yes,
	});
	const shouldClearSkill = changeStatus === SkillAssociationValueChangeStatus.noChange;

	const changeText = getChangeText({
		personName: personFragment.name,
		skillAssociationName: skillAssociation?.data?.skill?.name ?? skill?.name ?? "Unknown Name",
		updatedValue: { kind: "binary", hasSkill: updatedValue !== BinaryInput.no },
		previousValue:
			skillAssociation?.data?.value?.hasSkill !== undefined
				? {
						kind: "binary",
						hasSkill: skillAssociation?.data?.value?.hasSkill,
				  }
				: undefined,
		changeStatus,
	});
	const createActionButtonOnClickHandler = (shouldClearSkill: boolean) => () => {
		if (shouldClearSkill) {
			return disassociateSkill({
				variables: {
					input: {
						skillId: skillAssociation?.data?.skill?.id ?? skill.id,
						personId: personFragment.id,
					},
				},
				onCompleted: () => {
					handleOnHide();
				},
				onError: () => {
					toast.error("An error occurred.");
				},
			});
		}

		return associateSkill({
			variables: {
				input: {
					data: {
						skillId: skillAssociation?.data?.skill?.id ?? skill.id,
						value: {
							binary: {
								kind: "binary",
								hasSkill:
									updatedValue === BinaryInput.no
										? false
										: updatedValue === BinaryInput.yes,
							},
						},
						personId: personFragment.id,
					},
				},
			},
			onCompleted: () => {
				handleOnHide();
			},
			onError: () => {
				toast.error("An error occurred.");
			},
		});
	};
	return (
		<TkComponentsContext.Provider value={SkillAssessmentTheme}>
			<Dialog title={headerMap[changeStatus]} visible={isVisible} onHide={handleOnHide}>
				<Suspense fallback={<Loader />}>{changeText}</Suspense>
				<Wrapper>
					<Flex1Wrapper>
						<Button
							onClick={handleOnHide}
							content={{ label: "Cancel" }}
							inputVariant={"subtle"}
						/>
					</Flex1Wrapper>
					<Flex1Wrapper>
						<Button
							disabled={isAssociating || isDisassociating}
							onClick={createActionButtonOnClickHandler(shouldClearSkill)}
							content={{ label: buttonLabelMap[changeStatus] }}
							inputVariant={inputVariantMap[changeStatus]}
						/>
					</Flex1Wrapper>
				</Wrapper>
			</Dialog>
		</TkComponentsContext.Provider>
	);
};
