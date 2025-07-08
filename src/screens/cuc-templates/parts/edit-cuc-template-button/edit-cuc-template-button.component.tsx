import React, { useState } from "react";
import { readInlineData, useFragment, useMutation } from "react-relay";
import { type MarkerInput } from "@components/cuc-field/cuc-field.types";
import {
	convertCUCToMarkerInputs,
	convertMarkerInputsToCUCInput,
} from "@components/cuc-field/cuc-field.utils";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { type editCucTemplateButton_CucTemplateFragment$key } from "@relay/editCucTemplateButton_CucTemplateFragment.graphql";
import { type editCucTemplateButton_EditCucTemplateDataMutation } from "@relay/editCucTemplateButton_EditCucTemplateDataMutation.graphql";
import { type editCucTemplateButton_SetCucTemplateCucMutation } from "@relay/editCucTemplateButton_SetCucTemplateCucMutation.graphql";
import {
	CUC_TEMPLATE_FRAGMENT,
	EDIT_CUC_TEMPLATE_MUTATION,
	SET_CUC_TEMPLATE_CUC_MUTATION,
} from "@screens/cuc-templates/parts/edit-cuc-template-button/edit-cuc-template-button.graphql";
import { type EditCucTemplateButtonProps } from "@screens/cuc-templates/parts/edit-cuc-template-button/edit-cuc-template-button.types";
import { EditCucTemplateForm } from "@screens/cuc-templates/parts/edit-cuc-template-form";
import { type cucTemplateSchema } from "@screens/cuc-templates/parts/edit-cuc-template-form/edit-cuc-template-form.consts";

export const EditCucTemplateButton = ({ cucTemplateFragmentRef }: EditCucTemplateButtonProps) => {
	const [isVisible, setVisible] = useState(false);

	const node = useFragment<editCucTemplateButton_CucTemplateFragment$key>(
		CUC_TEMPLATE_FRAGMENT,
		cucTemplateFragmentRef,
	);
	const [commitEdit] = useMutation<editCucTemplateButton_EditCucTemplateDataMutation>(
		EDIT_CUC_TEMPLATE_MUTATION,
	);
	const [commitSetCuc] = useMutation<editCucTemplateButton_SetCucTemplateCucMutation>(
		SET_CUC_TEMPLATE_CUC_MUTATION,
	);

	const cuc = readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
		CUC_INLINE_FRAGMENT,
		node.cuc,
	);
	return (
		<WithFeatureToggle featureId={"CUC"}>
			<TkButtonLink
				icon="pi pi-pencil"
				iconPos="left"
				label="Edit"
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<typeof cucTemplateSchema, string>
				title={"Edit cuc template"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<div>
							<EditCucTemplateForm
								ref={ref}
								initialValues={{
									name: node.name,
									cuc: convertCUCToMarkerInputs(cuc)?.sort(
										(a, b) => a.percentageTime - b.percentageTime,
									)!,
								}}
								onSubmit={(values) => {
									commitEdit({
										variables: {
											input: {
												cucTemplateId: node.id,
												name: values.name,
											},
										},
										onCompleted: (response) => {
											commitSetCuc({
												variables: {
													input: {
														cucTemplateId: node.id,
														cuc: convertMarkerInputsToCUCInput(
															values.cuc as MarkerInput[],
														)!,
													},
												},
												onCompleted: () => {
													onHide();
												},
											});
										},
										onError: () => {
											ref.current?.setSubmitting(false);
											onHide();
										},
									});
								}}
							/>
						</div>
					);
				}}
			/>
		</WithFeatureToggle>
	);
};
