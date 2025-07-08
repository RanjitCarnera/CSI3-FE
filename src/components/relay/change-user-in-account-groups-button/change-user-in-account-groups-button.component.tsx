import { TkButtonLink } from "../../ui/TkButtonLink";
import { useFragment } from "react-relay";
import { useState } from "react";
import { ChangeUserInAccountGroupsModal } from "../change-user-in-account-groups-modal/change-user-in-account-groups-modal.component";
import { changeUserInAccountGroupsButton_UserInAccountFragment$key } from "@relay/changeUserInAccountGroupsButton_UserInAccountFragment.graphql";
import { ChangeUserInAccountGroupsButtonProps } from "@components/relay/change-user-in-account-groups-button/change-user-in-account-groups-button.interface";
import { CHANGE_USER_IN_ACCOUNT_GROUPS_BUTTON_FRAGMENT } from "@components/relay/change-user-in-account-groups-button/change-user-in-account-groups-button.graphql";

export const ChangeUserInAccountGroupsButton = ({
	className,
	userInAccountFragment,
}: ChangeUserInAccountGroupsButtonProps) => {
	const [isVisible, setVisible] = useState(false);
	const userInAccount = useFragment<changeUserInAccountGroupsButton_UserInAccountFragment$key>(
		CHANGE_USER_IN_ACCOUNT_GROUPS_BUTTON_FRAGMENT,
		userInAccountFragment,
	);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				onClick={() => setVisible(true)}
			/>

			<ChangeUserInAccountGroupsModal
				isVisible={isVisible}
				onHide={() => setVisible(false)}
				onCompleted={() => setVisible(false)}
				userInAccountFragmentRef={userInAccount}
			/>
		</>
	);
};
