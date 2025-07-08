import React, { useState } from "react";
import { useMutation } from "react-relay";
import type { CreateProjectButtonProps } from "@components/relay/create-project-button/create-project-button.interface";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButton } from "@components/ui/TkButton";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { type createMilestoneTemplateButton_CreateMilestoneTemplateMutation } from "@relay/createMilestoneTemplateButton_CreateMilestoneTemplateMutation.graphql";
import { CREATE_MILESTONE_TEMPLATE_MUTATION } from "@screens/milestone-templates/parts/create-milestone-template-button/create-milestone-template-button.graphql";
import { EditMilestoneTemplateDataForm } from "@screens/milestone-templates/parts/edit-milestone-template-data-form";
import { type milestoneTemplateDataSchema } from "@screens/milestone-templates/parts/edit-milestone-template-data-form/edit-milestone-template-data-form.consts";

export const CreateMilestoneTemplateButton = ({ connectionId }: CreateProjectButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [commitCreate] =
		useMutation<createMilestoneTemplateButton_CreateMilestoneTemplateMutation>(
			CREATE_MILESTONE_TEMPLATE_MUTATION,
		);

	return (
		<WithFeatureToggle featureId={"CUC"}>
			<div>
				<TkButton
					onClick={() => {
						setVisible(true);
					}}
					label={"Create new milestone template"}
				/>

				<SuspenseDialogWithState<typeof milestoneTemplateDataSchema>
					title={"Create milestone template"}
					isVisible={isVisible}
					onHide={() => {
						setVisible(false);
					}}
					affirmativeText={"Create"}
					formComponent={(ref, onHide) => {
						return (
							<EditMilestoneTemplateDataForm
								initialValues={{ name: "", timeInPercent: 1 }}
								ref={ref}
								onSubmit={(values) => {
									commitCreate({
										variables: {
											input: {
												name: values.name!,
												timeInPercent: values.timeInPercent!,
											},
											connections: connectionId ? [connectionId] : [],
										},
										onCompleted: () => {
											ref.current?.setSubmitting(false);
											onHide();
										},
										onError: () => {
											ref.current?.setSubmitting(false);
											onHide();
										},
									});
								}}
							/>
						);
					}}
				/>
			</div>
		</WithFeatureToggle>
	);
};
