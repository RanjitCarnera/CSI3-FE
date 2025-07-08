import { TkButtonLink } from "../../ui/TkButtonLink";
import { EditUserInAccountGroupModalComponent } from "../edit-user-in-account-group-modal/edit-user-in-account-group-modal.component";
import { useFragment } from "react-relay";
import { useState } from "react";
import { editUserInAccountGroupButton_GroupFragment$key } from "@relay/editUserInAccountGroupButton_GroupFragment.graphql";
import { EDIT_USER_IN_ACCOUNT_GROUP_BUTTON_FRAGMENT } from "@components/relay/edit-user-in-account-group-button/edit-user-in-account-group-button.graphql";
import { EditUserInAccountGroupButtonProps } from "@components/relay/edit-user-in-account-group-button/edit-user-in-account-group-button.interface";

export const EditUserInAccountGroupButton = ({
	className,
	groupFragmentRef,
}: EditUserInAccountGroupButtonProps) => {
	const [isVisible, setVisible] = useState(false);
	const group = useFragment<editUserInAccountGroupButton_GroupFragment$key>(
		EDIT_USER_IN_ACCOUNT_GROUP_BUTTON_FRAGMENT,
		groupFragmentRef,
	);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label="Edit"
				onClick={() => setVisible(true)}
			/>

			<EditUserInAccountGroupModalComponent
				isVisible={isVisible}
				onHide={() => setVisible(false)}
				onCompleted={() => setVisible(false)}
				groupFragmentRef={group}
			/>
		</>
	);
};
