import { graphql } from "babel-plugin-relay/macro";

export const EDIT_USER_IN_ACCOUNT_GROUP_MODAL_FRAGMENT = graphql`
	fragment editUserInAccountGroupModal_GroupFragment on UserInAccountGroup {
		id
		name
		permissions
	}
`;

export const EDIT_USER_IN_ACCOUNT_GROUP_MODAL_CREATE_MUTATION = graphql`
	mutation editUserInAccountGroupModal_CreateMutation(
		$input: CreateGroupInput!
		$connections: [ID!]!
	) {
		Management {
			createGroup(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...editUserInAccountGroupModal_GroupFragment
					}
				}
			}
		}
	}
`;

export const EDIT_USER_IN_ACCOUNT_GROUP_MODAL_EDIT_MUTATION = graphql`
	mutation editUserInAccountGroupModal_EditMutation(
		$input: EditGroupInput!
		$connections: [ID!]!
	) {
		Management {
			editGroup(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...editUserInAccountGroupModal_GroupFragment
					}
				}
			}
		}
	}
`;
