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
	calculateNumericalChangeStatus,
	getChangeText,
	SkillAssociationValueChangeStatus,
} from "@components/relay/edit-skill-association-modal/edit-skill-association-modal.util";
import {
	Flex1Wrapper,
	Wrapper,
} from "@components/relay/edit-skill-association-modal/parts/edit-binary-skill-association-modal/edit-binary-skill-association-modal.styles";
import {
	ASSOCIATE_SKILL_MUTATION,
	DISASSOCIATE_SKILL_MUTATION,
	PERSON_FRAGMENT,
	SKILL_ASSOCIATION_FRAGMENT,
	SKILL_FRAGMENT,
} from "@components/relay/edit-skill-association-modal/parts/edit-numerical-skill-association-modal/edit-numerical-skill-association-modal.graphql";
import { type EditNumericalSkillAssociationModalProps } from "@components/relay/edit-skill-association-modal/parts/edit-numerical-skill-association-modal/edit-numerical-skill-association-modal.types";
import { Loader } from "@components/ui/Loader";
import { SkillAssessmentTheme } from "@corestyle/component-theme/component-theme";
import { type editNumericalSkillAssociationModal_AssociateSkillMutation } from "@relay/editNumericalSkillAssociationModal_AssociateSkillMutation.graphql";
import { type editNumericalSkillAssociationModal_DisassociateSkillMutation } from "@relay/editNumericalSkillAssociationModal_DisassociateSkillMutation.graphql";
import { type editNumericalSkillAssociationModal_PersonFragment$key } from "@relay/editNumericalSkillAssociationModal_PersonFragment.graphql";
import { type editNumericalSkillAssociationModal_SkillAssociationFragment$key } from "@relay/editNumericalSkillAssociationModal_SkillAssociationFragment.graphql";
import { type editNumericalSkillAssociationModal_SkillFragment$key } from "@relay/editNumericalSkillAssociationModal_SkillFragment.graphql";

export const EditNumericalSkillAssociationModal = ({
	skillAssociationFragmentRef,
	personFragmentRef,
	updatedValue,
	onHide: handleOnHide,
	isVisible,
	skillFragmentRef,
}: EditNumericalSkillAssociationModalProps) => {
	const skill = useFragment<editNumericalSkillAssociationModal_SkillFragment$key>(
		SKILL_FRAGMENT,
		skillFragmentRef,
	);
	const personFragment = useFragment<editNumericalSkillAssociationModal_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const skillAssociation =
		useFragment<editNumericalSkillAssociationModal_SkillAssociationFragment$key>(
			SKILL_ASSOCIATION_FRAGMENT,
			skillAssociationFragmentRef,
		);

	const [associateSkill, isAssociating] =
		useMutation<editNumericalSkillAssociationModal_AssociateSkillMutation>(
			ASSOCIATE_SKILL_MUTATION,
		);

	const [disassociateSkill, isDisassociating] =
		useMutation<editNumericalSkillAssociationModal_DisassociateSkillMutation>(
			DISASSOCIATE_SKILL_MUTATION,
		);

	const changeStatus = calculateNumericalChangeStatus({
		previousNumber: skillAssociation?.data?.value?.number ?? 0,
		updatedNumber: updatedValue,
	});

	const changeText = getChangeText({
		personName: personFragment.name,
		skillAssociationName: skillAssociation?.data?.skill?.name ?? skill.name ?? "Unknown Name",
		updatedValue: { kind: "numerical", number: updatedValue },
		previousValue: { kind: "numerical", number: skillAssociation?.data?.value?.number ?? 0 },
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
							numerical: {
								kind: "numerical",
								number: updatedValue,
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
	const shouldClearSkill = changeStatus === SkillAssociationValueChangeStatus.noChange;
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
