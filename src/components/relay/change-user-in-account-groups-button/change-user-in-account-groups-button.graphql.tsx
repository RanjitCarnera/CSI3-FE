import { graphql } from "babel-plugin-relay/macro";

export const CHANGE_USER_IN_ACCOUNT_GROUPS_BUTTON_FRAGMENT = graphql`
	fragment changeUserInAccountGroupsButton_UserInAccountFragment on UserInAccount {
		...changeUserInAccountGroupsModal_UserInAccountFragment
	}
`;
