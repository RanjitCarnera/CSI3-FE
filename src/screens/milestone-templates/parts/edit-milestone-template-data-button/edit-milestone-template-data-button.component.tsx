import React, { useState } from "react";
import { useFragment, useMutation } from "react-relay";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { useDialogLogic } from "@components/ui/useDialogLogic";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { type editMilestoneTemplateDataButton_EditMilestoneTemplateDataMutation } from "@relay/editMilestoneTemplateDataButton_EditMilestoneTemplateDataMutation.graphql";
import { type editMilestoneTemplateDataButton_MilestoneTemplateFragment$key } from "@relay/editMilestoneTemplateDataButton_MilestoneTemplateFragment.graphql";
import {
	EDIT_MILESTONE_TEMPLATE_DATA_MUTATION,
	MILESTONE_TEMPLATE_FRAGMENT,
} from "@screens/milestone-templates/parts/edit-milestone-template-data-button/edit-milestone-template-data-button.graphql";
import { type EditMilestoneTemplateDataButtonProps } from "@screens/milestone-templates/parts/edit-milestone-template-data-button/edit-milestone-template-data-button.types";
import { EditMilestoneTemplateDataForm } from "@screens/milestone-templates/parts/edit-milestone-template-data-form";
import { type milestoneTemplateDataSchema } from "@screens/milestone-templates/parts/edit-milestone-template-data-form/edit-milestone-template-data-form.consts";

export const EditMilestoneTemplateDataButton = ({
	milestoneTemplateFragmentRef,
}: EditMilestoneTemplateDataButtonProps) => {
	const { showDialog, dialogComponent } = useDialogLogic();
	const [isVisible, setVisible] = useState(false);

	const node = useFragment<editMilestoneTemplateDataButton_MilestoneTemplateFragment$key>(
		MILESTONE_TEMPLATE_FRAGMENT,
		milestoneTemplateFragmentRef,
	);
	const [commitEdit] =
		useMutation<editMilestoneTemplateDataButton_EditMilestoneTemplateDataMutation>(
			EDIT_MILESTONE_TEMPLATE_DATA_MUTATION,
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

			<SuspenseDialogWithState<typeof milestoneTemplateDataSchema, string>
				title={"Edit milestone template"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<div>
							<EditMilestoneTemplateDataForm
								ref={ref}
								initialValues={{
									name: node.data.name,
									timeInPercent: node.data.timeInPercent,
								}}
								onSubmit={(values) => {
									commitEdit({
										variables: {
											input: {
												milestoneTemplateId: node.id,
												data: {
													name: values.name,
													timeInPercent: values.timeInPercent,
												},
												ignoreWarning: false,
											},
										},
										onCompleted: (response) => {
											const responseData =
												response.MilestoneTemplate.editMilestoneTemplateData
													?.response;
											if (
												responseData?.kind ===
												"WarningEditMilestoneTemplateDataResponse"
											) {
												showDialog({
													title: "Edit milestone template data warning",
													content: `Do you really want to edit ${
														values.name
													}? This milestone is still used on assignment roles: ${responseData.warnings
														?.flatMap((e) =>
															e.assignmentRoles.flatMap(
																(e) => e.name,
															),
														)
														.join(", ")}.`,
													affirmativeText: "Edit",
													negativeText: "Cancel",
													dialogCallback: (result) => {
														if (result === "Accept") {
															commitEdit({
																variables: {
																	input: {
																		milestoneTemplateId:
																			node.id,
																		data: {
																			name: values.name,
																			timeInPercent:
																				values.timeInPercent,
																		},
																		ignoreWarning: true,
																	},
																},
																onCompleted: (res) => {
																	ref.current?.setSubmitting(
																		false,
																	);
																	onHide();
																},
															});
														} else {
															ref.current?.setSubmitting(false);
															onHide();
														}
													},
												});
											} else {
												ref.current?.setSubmitting(false);
												onHide();
											}
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
			{dialogComponent}
		</WithFeatureToggle>
	);
};
