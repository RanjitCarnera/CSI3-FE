import { graphql } from "babel-plugin-relay/macro";

export const SELECT_USER_IN_ACCOUNT_GROUPS_OF_ACCOUNT_ADMIN_QUERY = graphql`
	query selectUserInAccountGroupsOfAccountAdminField_Query($accountId: ID!) {
		Admin {
			Management {
				UserInAccountGroupsInAccountAdmin(first: 50, accountId: $accountId) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		}
	}
`;
