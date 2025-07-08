import graphql from "babel-plugin-relay/macro";

export const USER_IN_ACCOUNT_GROUPS_TABLE_QUERY = graphql`
	query userInAccountGroupsTable_Query($first: Int) {
		...userInAccountGroupsTable_GroupListFragment @arguments(first: $first)
	}
`;

export const USER_IN_ACCOUNT_GROUPS_TABLE_LIST_FRAGMENT = graphql`
	fragment userInAccountGroupsTable_GroupListFragment on Query
	@refetchable(queryName: "userInAccountGroupsTable_Refetch")
	@argumentDefinitions(first: { type: "Int", defaultValue: 20 }, after: { type: "String" }) {
		Management {
			Groups(first: $first, after: $after)
				@connection(key: "userInAccountGroupsTable_Groups") {
				__id
				edges {
					node {
						...userInAccountGroupsTable_userInAccountGroupInlineFragment
					}
				}
			}
		}
	}
`;

// TODO fix then, also add in backend to mutations
export const USER_IN_ACCOUNT_GROUP_INLINE_FRAGMENT = graphql`
	fragment userInAccountGroupsTable_userInAccountGroupInlineFragment on UserInAccountGroup
	@inline {
		id
		name
		permissions
		...editUserInAccountGroupButton_GroupFragment
	}
`;
