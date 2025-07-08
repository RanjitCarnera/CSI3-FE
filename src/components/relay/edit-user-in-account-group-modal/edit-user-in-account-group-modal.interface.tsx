import {
	editUserInAccountGroupModal_GroupFragment$key,
	Permission,
} from "@relay/editUserInAccountGroupModal_GroupFragment.graphql";

export interface EditUserInAccountGroupModalComponentProps {
	groupFragmentRef?: editUserInAccountGroupModal_GroupFragment$key | null;
	onCompleted?: () => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

export interface EditUserInAccountGroupModalComponentFormState {
	name?: string;
	permissions?: Permission[];
}
