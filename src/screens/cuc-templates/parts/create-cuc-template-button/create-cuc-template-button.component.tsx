import React, { useState } from "react";
import { useMutation } from "react-relay";
import { DEFAULT_CUC_FIELD_MARKERS } from "@components/cuc-field/cuc-field.consts";
import { type MarkerInput } from "@components/cuc-field/cuc-field.types";
import { convertMarkerInputsToCUCInput } from "@components/cuc-field/cuc-field.utils";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButton } from "@components/ui/TkButton";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { type createCucTemplateButton_CreateCucTemplateMutation } from "@relay/createCucTemplateButton_CreateCucTemplateMutation.graphql";
import { CREATE_CUC_TEMPLATE_MUTATION } from "@screens/cuc-templates/parts/create-cuc-template-button/create-cuc-template-button.graphql";
import { EditCucTemplateForm } from "@screens/cuc-templates/parts/edit-cuc-template-form";
import { type cucTemplateSchema } from "@screens/cuc-templates/parts/edit-cuc-template-form/edit-cuc-template-form.consts";

export const CreateCucTemplateButton = ({ connectionId }: { connectionId: string }) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [commitCreate] = useMutation<createCucTemplateButton_CreateCucTemplateMutation>(
		CREATE_CUC_TEMPLATE_MUTATION,
	);

	return (
		<WithFeatureToggle featureId={"CUC"}>
			<div>
				<TkButton
					onClick={() => {
						setVisible(true);
					}}
					label={"Create new cuc template"}
				/>

				<SuspenseDialogWithState<typeof cucTemplateSchema>
					title={"Create cuc template"}
					isVisible={isVisible}
					onHide={() => {
						setVisible(false);
					}}
					affirmativeText={"Create"}
					formComponent={(ref, onHide) => {
						return (
							<EditCucTemplateForm
								initialValues={{ name: "", cuc: DEFAULT_CUC_FIELD_MARKERS }}
								ref={ref}
								onSubmit={(values) => {
									if (!values.cuc) return;

									commitCreate({
										variables: {
											input: {
												name: values.name!,
												cuc: convertMarkerInputsToCUCInput(
													values.cuc as MarkerInput[],
												)!,
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
