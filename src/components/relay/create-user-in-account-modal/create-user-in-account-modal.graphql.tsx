import { graphql } from "babel-plugin-relay/macro";

export const CREATE_USER_IN_ACCOUNT_MODAL_MUTATION = graphql`
	mutation createUserInAccountModal_CreateMutation(
		$input: CreateUserInAccountAdminInput!
		$connections: [ID!]!
	) {
		Admin {
			Management {
				createUserInAccountAdmin(input: $input) {
					edge @appendEdge(connections: $connections) {
						node {
							id
							user {
								id
								email
								name
							}
							groups {
								id
								name
							}
							...ChangeUserGroupsAdminButton_UserInAccountFragment
						}
					}
				}
			}
		}
	}
`;

export const CREATE_USER_IN_ACCOUNT_ADD_MUTATION = graphql`
	mutation createUserInAccountModal_AddMutation(
		$input: AddUserToAccountAdminInput!
		$connections: [ID!]!
	) {
		Admin {
			Management {
				addUserToAccountAdmin(input: $input) {
					edge @appendEdge(connections: $connections) {
						node {
							id
							user {
								id
								email
								name
							}
							groups {
								id
								name
							}
							...ChangeUserGroupsAdminButton_UserInAccountFragment
						}
					}
				}
			}
		}
	}
`;
