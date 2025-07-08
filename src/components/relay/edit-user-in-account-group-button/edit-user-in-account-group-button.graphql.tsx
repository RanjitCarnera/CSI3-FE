import { graphql } from "babel-plugin-relay/macro";

export const EDIT_USER_IN_ACCOUNT_GROUP_BUTTON_FRAGMENT = graphql`
	fragment editUserInAccountGroupButton_GroupFragment on UserInAccountGroup {
		...editUserInAccountGroupModal_GroupFragment
	}
`;
