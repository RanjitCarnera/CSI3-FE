import { changeUserInAccountGroupsModal_UserInAccountFragment$key } from "@relay/changeUserInAccountGroupsModal_UserInAccountFragment.graphql";

export interface ChangeUserInAccountGroupsModalProps {
	userInAccountFragmentRef: changeUserInAccountGroupsModal_UserInAccountFragment$key;
	onCompleted?: () => void;

	isVisible: boolean;
	onHide: () => void;
}

export interface ChangeUserInAccountGroupsModalFormState {
	groups?: string[];
}
