import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React, { Suspense } from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { UsersInAccountAdminTable } from "./users-in-account-admin-table/users-in-account-admin-table.component";
import { type EditAccountModal_AccountFragment$key } from "../../__generated__/EditAccountModal_AccountFragment.graphql";
import { type EditAccountModal_CreateMutation } from "../../__generated__/EditAccountModal_CreateMutation.graphql";
import { type EditAccountModal_EditMutation } from "../../__generated__/EditAccountModal_EditMutation.graphql";
import { DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField } from "../ui/ValidatedField";

const FRAGMENT = graphql`
	fragment EditAccountModal_AccountFragment on Account {
		id
		name
		registeredAt
	}
`;

const CREATE_MUTATION = graphql`
	mutation EditAccountModal_CreateMutation(
		$input: CreateAccountAdminInput!
		$connections: [ID!]!
	) {
		Admin {
			Management {
				createAccountAdmin(input: $input) {
					edge @appendEdge(connections: $connections) {
						node {
							id
							...EditAccountButton_AccountFragment
						}
					}
				}
			}
		}
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditAccountModal_EditMutation($input: EditAccountAdminInput!) {
		Admin {
			Management {
				editAccountAdmin(input: $input) {
					edge {
						node {
							id
							...EditAccountButton_AccountFragment
						}
					}
				}
			}
		}
	}
`;

interface OwnProps {
	accountFragmentRef?: EditAccountModal_AccountFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	name?: string;
}

export const EditAccountModal = ({
	accountFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const account = useFragment<EditAccountModal_AccountFragment$key>(
		FRAGMENT,
		accountFragmentRef || null,
	);
	const [create] = useMutation<EditAccountModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<EditAccountModal_EditMutation>(EDIT_MUTATION);

	const formik = useFormik<FormState>({
		initialValues: {
			name: account?.name || "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const data = {
				name: values.name!,
			};
			if (account) {
				edit({
					variables: {
						input: {
							id: account.id,
							...data,
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Admin.Management.editAccountAdmin?.edge.node.id!);
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
						onCompleted &&
							onCompleted(
								response.Admin.Management.createAccountAdmin?.edge.node.id!,
							);
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{account ? "Edit account" : "Create new account"}</h1>}
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
						label={account ? "Save" : "Create"}
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

			{account ? (
				<>
					<h3>Users in accounts</h3>
					<Suspense fallback={"Loading..."}>
						<UsersInAccountAdminTable accountId={account.id} />
					</Suspense>
				</>
			) : null}
		</TkDialog>
	);
};
