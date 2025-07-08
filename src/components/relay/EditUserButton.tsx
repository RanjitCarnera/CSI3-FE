import { graphql } from "babel-plugin-relay/macro";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { type EditUserButton_EditMutation } from "../../__generated__/EditUserButton_EditMutation.graphql";
import { type EditUserButton_UserFragment$key } from "../../__generated__/EditUserButton_UserFragment.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { EditUserForm, type EditUserFormState } from "../ui/EditUserForm";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../ui/TkButtonLink";

const EDIT_MUTATION = graphql`
	mutation EditUserButton_EditMutation($input: EditUserInput!) {
		Admin {
			Auth {
				editUser(input: $input) {
					user {
						...EditUserButton_UserFragment
					}
				}
			}
		}
	}
`;

const FRAGMENT = graphql`
	fragment EditUserButton_UserFragment on User {
		id
		name
		email
		activated
	}
`;

interface OwnProps {
	className?: string;
	hideLabel?: boolean;
	userFragmentRef: EditUserButton_UserFragment$key;
}

export const EditUserButton = ({ className, hideLabel, userFragmentRef }: OwnProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasAccess = hasPermissions(["UserInAccountPermission_Management_Management"]);

	const [edit] = useMutation<EditUserButton_EditMutation>(EDIT_MUTATION);

	const [isVisible, setVisible] = useState(false);
	const user = useFragment<EditUserButton_UserFragment$key>(FRAGMENT, userFragmentRef);
	return hasAccess ? (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label={hideLabel ? "" : "Edit"}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<EditUserFormState>
				title={"Edit user"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<EditUserForm
							initialState={{
								name: user?.name,
								email: user?.email,
								activated: user?.activated,
							}}
							ref={ref}
							onSubmit={(values) => {
								edit({
									variables: {
										input: {
											userId: user.id,
											email: values.email!,
											activated: values.activated!,
											name: values.name!,
										},
									},
									onCompleted: () => {
										ref.current?.setSubmitting(false);
										onHide();
									},
									onError: () => {
										ref.current?.setSubmitting(false);
									},
								});
							}}
						/>
					);
				}}
			/>
		</>
	) : null;
};
