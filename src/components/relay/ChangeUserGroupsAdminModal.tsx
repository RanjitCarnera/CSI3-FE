import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React, { Suspense } from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { filterGroups } from "@components/relay/change-user-in-account-groups-modal";
import { SelectUserInAccountGroupsOfAccountAdminField } from "@components/relay/select-user-in-account-groups-of-account-admin-field";
import { type ChangeUserGroupsAdminModal_ChangeMutation } from "@relay/ChangeUserGroupsAdminModal_ChangeMutation.graphql";
import { type ChangeUserGroupsAdminModal_UserInAccountFragment$key } from "@relay/ChangeUserGroupsAdminModal_UserInAccountFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField } from "../ui/ValidatedField";

const FRAGMENT = graphql`
	fragment ChangeUserGroupsAdminModal_UserInAccountFragment on UserInAccount {
		id
		user {
			id
		}
		groups {
			id
		}
	}
`;

const CHANGE_MUTATION = graphql`
	mutation ChangeUserGroupsAdminModal_ChangeMutation($input: ChangeUserGroupsAdminInput!) {
		Admin {
			Management {
				changeUserGroupsAdmin(input: $input) {
					edge {
						node {
							id
							...ChangeUserGroupsAdminModal_UserInAccountFragment
						}
					}
				}
			}
		}
	}
`;

interface OwnProps {
	accountId: string;
	userInAccountFragmentRef: ChangeUserGroupsAdminModal_UserInAccountFragment$key;
	onCompleted?: () => void;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	groups?: string[];
}

export const ChangeUserGroupsAdminModal = ({
	accountId,
	userInAccountFragmentRef,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const userInAccount = useFragment<ChangeUserGroupsAdminModal_UserInAccountFragment$key>(
		FRAGMENT,
		userInAccountFragmentRef || null,
	);

	const [change] = useMutation<ChangeUserGroupsAdminModal_ChangeMutation>(CHANGE_MUTATION);

	const formik = useFormik<FormState>({
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
						accountId,
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
				<ValidatedField<FormState, string[]>
					className="mb-4"
					name={"groups"}
					label={"Groups"}
					required={true}
					formikConfig={formik}
					component={(config) => (
						<Suspense fallback={"Loading..."}>
							<SelectUserInAccountGroupsOfAccountAdminField
								accountId={accountId}
								config={config}
							/>
						</Suspense>
					)}
				/>
			</Form>
		</TkDialog>
	);
};
