import { graphql } from "babel-plugin-relay/macro";
import { useFragment, useMutation } from "react-relay";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { EditRegionModal_RegionFragment$key } from "../../__generated__/EditRegionModal_RegionFragment.graphql";
import { EditRegionModal_CreateMutation } from "../../__generated__/EditRegionModal_CreateMutation.graphql";
import { EditRegionModal_EditMutation } from "../../__generated__/EditRegionModal_EditMutation.graphql";
import { TkDialog } from "../ui/TkDialog";
import { TkButtonLink } from "../ui/TkButtonLink";
import { ValidatedField } from "../ui/ValidatedField";
import { DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { Form } from "@thekeytechnology/framework-react-components";

const PERSON_FRAGMENT = graphql`
	fragment EditRegionModal_RegionFragment on Region {
		id
		name
	}
`;

const CREATE_MUTATION = graphql`
	mutation EditRegionModal_CreateMutation($input: CreateRegionInput!, $connections: [ID!]!) {
		Region {
			createRegion(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...EditRegionButton_RegionFragment
					}
				}
			}
		}
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditRegionModal_EditMutation($input: EditRegionInput!) {
		Region {
			editRegion(input: $input) {
				edge {
					node {
						id
						...EditRegionButton_RegionFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	RegionFragmentRef?: EditRegionModal_RegionFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	name?: string;
}

export const EditRegionModal = ({
	RegionFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const region = useFragment<EditRegionModal_RegionFragment$key>(
		PERSON_FRAGMENT,
		RegionFragmentRef || null,
	);
	const [create] = useMutation<EditRegionModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<EditRegionModal_EditMutation>(EDIT_MUTATION);

	const formik = useFormik<FormState>({
		initialValues: {
			name: region?.name || "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const data = {
				name: values.name!,
			};
			if (region) {
				edit({
					variables: {
						input: {
							regionId: region.id,
							...data,
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted && onCompleted(response.Region.editRegion?.edge.node.id!);
						resetForm({});
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
						onCompleted && onCompleted(response.Region.createRegion?.edge.node.id!);
						resetForm({});
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{region ? "Edit region" : "Create new region"}</h1>}
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
						label={region ? "Save" : "Create"}
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
