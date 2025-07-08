import React, { useContext, useEffect } from "react";
import { CreateTemplateFormContext } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.context";
import { useFragment, useMutation } from "react-relay";
import { CreateTemplateFormState } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.types";
import { toast } from "react-toastify";
import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import { CreateTemplateForm } from "@screens/skill-assessment-templates/parts/create-template-form";
import {
	ASSESSMENT_TEMPLATE_FRAGMENT,
	EDIT_ASSESSMENT_TEMPLATE_MUTATION,
} from "@screens/skill-assessment-templates/parts/edit-template-button/edit-template-button.graphql";
import { EditTemplateButtonProps } from "@screens/skill-assessment-templates/parts/edit-template-button/edit-template-button.types";
import { editTemplateButton_EditAssessmentTemplateMutation } from "@relay/editTemplateButton_EditAssessmentTemplateMutation.graphql";

export const EditTemplateButton = ({ assessmentTemplateFragmentRef }: EditTemplateButtonProps) => {
	const template = useFragment(ASSESSMENT_TEMPLATE_FRAGMENT, assessmentTemplateFragmentRef);
	const { connectionId } = useContext(CreateTemplateFormContext);
	const [editTemplate] = useMutation<editTemplateButton_EditAssessmentTemplateMutation>(
		EDIT_ASSESSMENT_TEMPLATE_MUTATION,
	);
	const handleSubmit = (values: CreateTemplateFormState, onHide: () => void) => {
		editTemplate({
			variables: {
				input: {
					id: template.id,
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
				toast.error("Could not edit an assessment template.");
			},
		});
	};

	useEffect(() => {
		window.addEventListener("click", (e) => {});
	}, []);

	return (
		<FormDialogButton<CreateTemplateFormState>
			buttonContent={{
				label: "Edit",
				icon: "pi pi-pencil",
			}}
			title={"Edit Template"}
			buttonVariant={"subtle"}
		>
			{(ref, onHide) => {
				return (
					<CreateTemplateForm
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide);
						}}
						initialState={{
							name: template.name,
							jobTitles: template.associatedRoles.map((e) => e.id),
							skills: template.assessedSkills.map((e) => e.id),
							distributionListRole: [...(template.distributionList.role ?? [])],
							distributionListEmails: [...(template.distributionList.emails ?? [])],
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
