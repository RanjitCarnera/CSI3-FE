import { graphql } from "babel-plugin-relay/macro";
import { useFragment, useMutation } from "react-relay";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { EditDivisionModal_DivisionFragment$key } from "../../__generated__/EditDivisionModal_DivisionFragment.graphql";
import { EditDivisionModal_CreateMutation } from "../../__generated__/EditDivisionModal_CreateMutation.graphql";
import { EditDivisionModal_EditMutation } from "../../__generated__/EditDivisionModal_EditMutation.graphql";
import { TkDialog } from "../ui/TkDialog";
import { TkButtonLink } from "../ui/TkButtonLink";
import { ValidatedField } from "../ui/ValidatedField";
import { DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { Form } from "@thekeytechnology/framework-react-components";

const PERSON_FRAGMENT = graphql`
	fragment EditDivisionModal_DivisionFragment on Division {
		id
		name
	}
`;

const CREATE_MUTATION = graphql`
	mutation EditDivisionModal_CreateMutation($input: CreateDivisionInput!, $connections: [ID!]!) {
		Division {
			createDivision(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...EditDivisionButton_DivisionFragment
					}
				}
			}
		}
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditDivisionModal_EditMutation($input: EditDivisionInput!) {
		Division {
			editDivision(input: $input) {
				edge {
					node {
						id
						...EditDivisionButton_DivisionFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	DivisionFragmentRef?: EditDivisionModal_DivisionFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	name?: string;
}

export const EditDivisionModal = ({
	DivisionFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const division = useFragment<EditDivisionModal_DivisionFragment$key>(
		PERSON_FRAGMENT,
		DivisionFragmentRef || null,
	);
	const [create] = useMutation<EditDivisionModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<EditDivisionModal_EditMutation>(EDIT_MUTATION);

	const formik = useFormik<FormState>({
		initialValues: {
			name: division?.name || "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const data = {
				name: values.name!,
			};
			if (division) {
				edit({
					variables: {
						input: {
							divisionId: division.id,
							...data,
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						resetForm({});
						onCompleted && onCompleted(response.Division.editDivision?.edge.node.id!);
					},
				});
			} else {
				create({
					variables: {
						input: {
							...data,
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: (response) => {
						setSubmitting(false);
						resetForm({});
						onCompleted && onCompleted(response.Division.createDivision?.edge.node.id!);
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{division ? "Edit division" : "Create new division"}</h1>}
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
						label={division ? "Save" : "Create"}
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
			</Form>
		</TkDialog>
	);
};
