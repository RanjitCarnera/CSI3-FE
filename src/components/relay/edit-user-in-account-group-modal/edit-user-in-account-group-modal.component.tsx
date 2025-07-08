import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import {
	EDIT_USER_IN_ACCOUNT_GROUP_MODAL_CREATE_MUTATION,
	EDIT_USER_IN_ACCOUNT_GROUP_MODAL_EDIT_MUTATION,
	EDIT_USER_IN_ACCOUNT_GROUP_MODAL_FRAGMENT,
} from "@components/relay/edit-user-in-account-group-modal/edit-user-in-account-group-modal.graphql";
import {
	type EditUserInAccountGroupModalComponentFormState,
	type EditUserInAccountGroupModalComponentProps,
} from "@components/relay/edit-user-in-account-group-modal/edit-user-in-account-group-modal.interface";
import { type editUserInAccountGroupModal_CreateMutation } from "@relay/editUserInAccountGroupModal_CreateMutation.graphql";
import { type editUserInAccountGroupModal_EditMutation } from "@relay/editUserInAccountGroupModal_EditMutation.graphql";
import {
	type editUserInAccountGroupModal_GroupFragment$key,
	type Permission,
} from "@relay/editUserInAccountGroupModal_GroupFragment.graphql";
import { DefaultTextFieldComponent } from "../../ui/DefaultTextInput";
import { TkButtonLink } from "../../ui/TkButtonLink";
import { TkDialog } from "../../ui/TkDialog";
import { ValidatedField } from "../../ui/ValidatedField";
import { PermissionSuspenseField } from "../PermissionsField";

export const EditUserInAccountGroupModalComponent = ({
	groupFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: EditUserInAccountGroupModalComponentProps) => {
	const group = useFragment<editUserInAccountGroupModal_GroupFragment$key>(
		EDIT_USER_IN_ACCOUNT_GROUP_MODAL_FRAGMENT,
		groupFragmentRef || null,
	);

	const [create] = useMutation<editUserInAccountGroupModal_CreateMutation>(
		EDIT_USER_IN_ACCOUNT_GROUP_MODAL_CREATE_MUTATION,
	);
	const [edit] = useMutation<editUserInAccountGroupModal_EditMutation>(
		EDIT_USER_IN_ACCOUNT_GROUP_MODAL_EDIT_MUTATION,
	);

	const formik = useFormik<EditUserInAccountGroupModalComponentFormState>({
		initialValues: {
			name: group?.name || "",
			permissions: group?.permissions ? [...group.permissions] : [],
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
			permissions: Yup.array().required("Permissions are required"),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			if (group) {
				edit({
					variables: {
						input: {
							id: group.id,
							name: values.name!,
							permissions: values.permissions!,
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: () => {
						setSubmitting(false);
						onCompleted && onCompleted();
						resetForm({});
					},
					onError: (e) => {
						console.error(e);
						setSubmitting(false);
					},
				});
			} else {
				create({
					variables: {
						input: {
							name: values.name!,
							permissions: values.permissions!,
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: () => {
						setSubmitting(false);
						onCompleted && onCompleted();
					},
					onError: (e) => {
						console.error(e);
						setSubmitting(false);
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{group ? "Edit group" : "Create group"}</h1>}
			visible={isVisible}
			onHide={() => {
				onHide();
			}}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => {
							onHide();
						}}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						label={group ? "Edit group" : "Create group"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<EditUserInAccountGroupModalComponentFormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<EditUserInAccountGroupModalComponentFormState, Permission[]>
					className="mb-4"
					name={"permissions"}
					required={true}
					formikConfig={formik}
					component={PermissionSuspenseField}
				/>
			</Form>
		</TkDialog>
	);
};
