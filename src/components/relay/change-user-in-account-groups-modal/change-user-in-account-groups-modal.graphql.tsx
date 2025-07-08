import { graphql } from "babel-plugin-relay/macro";

export const CHANGE_USER_IN_ACCOUNT_GROUPS_MODAL_FRAGMENT = graphql`
	fragment changeUserInAccountGroupsModal_UserInAccountFragment on UserInAccount {
		id
		user {
			id
		}
		groups {
			id
		}
	}
`;

export const CHANGE_USER_IN_ACCOUNT_GROUPS_MODAL_MUTATION = graphql`
	mutation changeUserInAccountGroupsModal_ChangeMutation(
		$input: ChangeUserInAccountGroupsInput!
	) {
		Management {
			changeUserInAccountGroups(input: $input) {
				edge {
					node {
						id
						...changeUserInAccountGroupsModal_UserInAccountFragment
					}
				}
			}
		}
	}
`;
