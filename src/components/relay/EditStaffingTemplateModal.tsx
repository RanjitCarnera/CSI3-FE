import { graphql } from "babel-plugin-relay/macro";
import { useFragment, useMutation } from "react-relay";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { EditStaffingTemplateModal_StaffingTemplateFragment$key } from "../../__generated__/EditStaffingTemplateModal_StaffingTemplateFragment.graphql";
import { EditStaffingTemplateModal_CreateMutation } from "../../__generated__/EditStaffingTemplateModal_CreateMutation.graphql";
import {
	AssignmentRoleAssociationInput,
	EditStaffingTemplateModal_EditMutation,
} from "../../__generated__/EditStaffingTemplateModal_EditMutation.graphql";
import { TkDialog } from "../ui/TkDialog";
import { TkButtonLink } from "../ui/TkButtonLink";
import { ValidatedField } from "../ui/ValidatedField";
import { DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { AssignmentRoleAssociationField } from "./AssignmentRoleAssociationField";
import { Form } from "@thekeytechnology/framework-react-components";

const PERSON_FRAGMENT = graphql`
	fragment EditStaffingTemplateModal_StaffingTemplateFragment on StaffingTemplate {
		id
		name
		assignmentRoleAssociations {
			assignmentRoleRef
			isExecutive
		}
	}
`;

const CREATE_MUTATION = graphql`
	mutation EditStaffingTemplateModal_CreateMutation(
		$input: CreateStaffingTemplateInput!
		$connections: [ID!]!
	) {
		Template {
			createStaffingTemplate(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...EditStaffingTemplateButton_StaffingTemplateFragment
					}
				}
			}
		}
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditStaffingTemplateModal_EditMutation($input: EditStaffingTemplateInput!) {
		Template {
			editStaffingTemplate(input: $input) {
				edge {
					node {
						id
						...EditStaffingTemplateButton_StaffingTemplateFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	staffingTemplateFragmentRef?: EditStaffingTemplateModal_StaffingTemplateFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	name?: string;
	assignmentRoleAssociations?: AssignmentRoleAssociationInput[];
}

export const EditStaffingTemplateModal = ({
	staffingTemplateFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const staffingTemplate = useFragment<EditStaffingTemplateModal_StaffingTemplateFragment$key>(
		PERSON_FRAGMENT,
		staffingTemplateFragmentRef || null,
	);
	const [create] = useMutation<EditStaffingTemplateModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<EditStaffingTemplateModal_EditMutation>(EDIT_MUTATION);

	const formik = useFormik<FormState>({
		initialValues: {
			name: staffingTemplate?.name || "",
			assignmentRoleAssociations: (staffingTemplate?.assignmentRoleAssociations || []) as any,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
			assignmentRoleAssociations: Yup.array()
				.min(1, "At least one assignment role is required.")
				.required("Assignment roles is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			if (staffingTemplate) {
				edit({
					variables: {
						input: {
							staffingTemplateId: staffingTemplate.id,
							data: {
								name: values.name!,
								assignmentRoleAssociations: values.assignmentRoleAssociations!,
							},
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Template.editStaffingTemplate?.edge.node.id!);
						resetForm({});
					},
				});
			} else {
				create({
					variables: {
						input: {
							data: {
								name: values.name!,
								assignmentRoleAssociations: values.assignmentRoleAssociations!,
							},
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Template.createStaffingTemplate?.edge.node.id!);
						resetForm({});
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={
				<h1>
					{staffingTemplate ? "Edit Staffing Template" : "Create new Staffing Template"}
				</h1>
			}
			visible={isVisible}
			onHide={() => onHide()}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => onHide()}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => formik.handleSubmit()}
						label={staffingTemplate ? "Save" : "Create"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>

				<ValidatedField<FormState, AssignmentRoleAssociationInput[]>
					className="mb-4"
					name={"assignmentRoleAssociations"}
					label={"Assignment Roles"}
					required={true}
					formikConfig={formik}
					component={AssignmentRoleAssociationField}
				/>
			</Form>
		</TkDialog>
	);
};
