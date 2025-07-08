import graphql from "babel-plugin-relay/macro";

export const USERS_IN_ACCOUNT_TABLE_QUERY = graphql`
	query usersInAccountTable_Query($first: Int) {
		...usersInAccountTable_UsersInAccountListFragment @arguments(first: $first)
	}
`;

export const USERS_IN_ACCOUNT_TABLE_LIST_FRAGMENT = graphql`
	fragment usersInAccountTable_UsersInAccountListFragment on Query
	@refetchable(queryName: "usersInAccountTable_Refetch")
	@argumentDefinitions(first: { type: "Int", defaultValue: 20 }, after: { type: "String" }) {
		Management {
			UsersInAccount(first: $first, after: $after)
				@connection(key: "usersInAccountTable_UsersInAccount") {
				__id
				edges {
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
						...changeUserInAccountGroupsButton_UserInAccountFragment
					}
				}
			}
		}
	}
`;
