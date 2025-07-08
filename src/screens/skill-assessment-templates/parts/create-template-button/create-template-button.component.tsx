import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import React, { useContext } from "react";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { type createTemplateButton_CreateAssessmentTemplateMutation } from "@relay/createTemplateButton_CreateAssessmentTemplateMutation.graphql";
import { CREATE_ASSESSMENT_TEMPLATE_MUTATION } from "@screens/skill-assessment-templates/parts/create-template-button/create-template-button.graphql";
import { CreateTemplateForm } from "@screens/skill-assessment-templates/parts/create-template-form";
import { CreateTemplateFormContext } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.context";
import { type CreateTemplateFormState } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.types";

export const CreateTemplateButton = () => {
	const { connectionId } = useContext(CreateTemplateFormContext);
	const [createAssessmentTemplate] =
		useMutation<createTemplateButton_CreateAssessmentTemplateMutation>(
			CREATE_ASSESSMENT_TEMPLATE_MUTATION,
		);
	const handleSubmit = (values: CreateTemplateFormState, onHide: () => void) => {
		createAssessmentTemplate({
			variables: {
				input: {
					data: {
						name: values.name ?? "",
						associatedRoleIds: values.jobTitles ?? [],
						assessedSkillIds: values.skills,
						distributionList: {
							role: values.distributionListRole,
							emails: values.distributionListEmails,
						},
					},
				},
				connections: [connectionId],
			},
			onCompleted: () => {
				onHide();
			},
			onError: () => {
				toast.error("Could not create an assessment template.");
			},
		});
	};
	return (
		<FormDialogButton<CreateTemplateFormState>
			buttonContent={{
				label: "New",
			}}
			title={"New Template"}
		>
			{(ref, onHide) => {
				return (
					<CreateTemplateForm
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide);
						}}
						initialState={{
							name: undefined,
							jobTitles: [],
							skills: [],
							distributionListRole: [],
							distributionListEmails: [],
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
