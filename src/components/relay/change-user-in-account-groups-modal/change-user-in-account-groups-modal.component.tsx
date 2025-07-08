import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import {
	CHANGE_USER_IN_ACCOUNT_GROUPS_MODAL_FRAGMENT,
	CHANGE_USER_IN_ACCOUNT_GROUPS_MODAL_MUTATION,
} from "@components/relay/change-user-in-account-groups-modal/change-user-in-account-groups-modal.graphql";
import {
	type ChangeUserInAccountGroupsModalFormState,
	type ChangeUserInAccountGroupsModalProps,
} from "@components/relay/change-user-in-account-groups-modal/change-user-in-account-groups-modal.interface";
import { filterGroups } from "@components/relay/change-user-in-account-groups-modal/change-user-in-account-groups-modal.util";
import { SelectGroupsSuspenseField } from "@components/relay/SelectGroupsField";
import { type changeUserInAccountGroupsModal_ChangeMutation } from "@relay/changeUserInAccountGroupsModal_ChangeMutation.graphql";
import { type changeUserInAccountGroupsModal_UserInAccountFragment$key } from "@relay/changeUserInAccountGroupsModal_UserInAccountFragment.graphql";
import { TkButtonLink } from "../../ui/TkButtonLink";
import { TkDialog } from "../../ui/TkDialog";
import { ValidatedField } from "../../ui/ValidatedField";

export const ChangeUserInAccountGroupsModal = ({
	userInAccountFragmentRef,
	onCompleted,
	isVisible,
	onHide,
}: ChangeUserInAccountGroupsModalProps) => {
	const userInAccount = useFragment<changeUserInAccountGroupsModal_UserInAccountFragment$key>(
		CHANGE_USER_IN_ACCOUNT_GROUPS_MODAL_FRAGMENT,
		userInAccountFragmentRef || null,
	);

	const [change] = useMutation<changeUserInAccountGroupsModal_ChangeMutation>(
		CHANGE_USER_IN_ACCOUNT_GROUPS_MODAL_MUTATION,
	);

	const formik = useFormik<ChangeUserInAccountGroupsModalFormState>({
		initialValues: {
			groups: filterGroups(userInAccount.groups || []).map((g) => g.id),
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			groups: Yup.array().required("Groups are required"),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			change({
				variables: {
					input: {
						userId: userInAccount.user.id,
						groupRefs: values.groups!,
					},
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
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>Change user's groups</h1>}
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
						label={"Change groups"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<ChangeUserInAccountGroupsModalFormState, string[]>
					className="mb-4"
					name={"groups"}
					label={"Groups"}
					required={true}
					formikConfig={formik}
					component={SelectGroupsSuspenseField}
				/>
			</Form>
		</TkDialog>
	);
};
