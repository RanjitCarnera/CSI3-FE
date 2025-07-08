import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { SelectAccountGroupsSuspenseField } from "./select-account-groups-field/select-account-groups-field.component";
import { type ChangeAccountGroupsAdminModal_AccountFragment$key } from "../../__generated__/ChangeAccountGroupsAdminModal_AccountFragment.graphql";
import { type ChangeAccountGroupsAdminModal_ChangeMutation } from "../../__generated__/ChangeAccountGroupsAdminModal_ChangeMutation.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField } from "../ui/ValidatedField";

const ACCOUNT_FRAGMENT = graphql`
	fragment ChangeAccountGroupsAdminModal_AccountFragment on Account {
		id
		groupAssociations {
			group {
				id
				name
			}
		}
	}
`;

const CHANGE_MUTATION = graphql`
	mutation ChangeAccountGroupsAdminModal_ChangeMutation($input: ChangeAccountGroupsInput!) {
		Admin {
			Management {
				changeAccountGroups(input: $input) {
					account {
						groupAssociations {
							group {
								id
								name
							}
						}
					}
				}
			}
		}
	}
`;

interface OwnProps {
	accountFragmentRef: ChangeAccountGroupsAdminModal_AccountFragment$key;
	onCompleted?: () => void;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	groups?: string[];
}

export const ChangeAccountGroupsAdminModal = ({
	accountFragmentRef,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const account = useFragment<ChangeAccountGroupsAdminModal_AccountFragment$key>(
		ACCOUNT_FRAGMENT,
		accountFragmentRef,
	);

	const [change] = useMutation<ChangeAccountGroupsAdminModal_ChangeMutation>(CHANGE_MUTATION);

	const formik = useFormik<FormState>({
		initialValues: {
			groups: (account?.groupAssociations || [])
				.map((g) => g.group?.id)
				.filter((x) => x)
				.map((x) => x!),
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			groups: Yup.array().required("Groups are required"),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			change({
				variables: {
					input: {
						accountId: account?.id!,
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
			header={<h1>Change account's groups</h1>}
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
					name={"groups"}
					label={"Groups"}
					required={true}
					formikConfig={formik}
					component={SelectAccountGroupsSuspenseField}
				/>
			</Form>
		</TkDialog>
	);
};
