import graphql from "babel-plugin-relay/macro";

export const USERS_IN_ACCOUNT_ADMIN_TABLE_QUERY = graphql`
	query usersInAccountAdminTable_Query($first: Int, $accountId: ID!) {
		...usersInAccountAdminTable_UsersInAccountListFragment
			@arguments(first: $first, accountId: $accountId)
	}
`;

export const USERS_IN_ACCOUNT_ADMIN_TABLE_LIST_FRAGMENT = graphql`
	fragment usersInAccountAdminTable_UsersInAccountListFragment on Query
	@refetchable(queryName: "usersInAccountAdminTable_Refetch")
	@argumentDefinitions(
		accountId: { type: "ID!" }
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
	) {
		Admin {
			Management {
				UsersInAccountAdmin(accountId: $accountId, first: $first, after: $after)
					@connection(key: "usersInAccountAdminTable_UsersInAccountAdmin") {
					__id
					pageInfo {
						endCursor
						hasPreviousPage
						hasNextPage
						startCursor
					}
					edges {
						node {
							...usersInAccountAdminTable_UserInlineFragment
						}
					}
				}
			}
		}
	}
`;

export const USERS_IN_ACCOUNT_ADMIN_TABLE_INLINE_FRAGMENT = graphql`
	fragment usersInAccountAdminTable_UserInlineFragment on UserInAccount @inline {
		id
		user {
			id
			email
			name
			activated
		}
		groups {
			id
			name
		}
		...ChangeUserGroupsAdminButton_UserInAccountFragment
	}
`;
