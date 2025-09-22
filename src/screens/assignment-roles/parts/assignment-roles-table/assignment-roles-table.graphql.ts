import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query assignmentRolesTable_Query($first: Int, $filterByName: String) {
		...assignmentRolesTable_AssignmentRolesQueryFragment
			@arguments(first: $first, filterByName: $filterByName)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment assignmentRolesTable_AssignmentRolesQueryFragment on Query
	@refetchable(queryName: "assignmentRolesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 200 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Assignments {
			AssignmentRoles(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "assignmentRolesTable_AssignmentRoles") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						name
						sortOrder
						maxNumberOfProjects
						utilizationProjectionCapInMonths
						countAsFullyAllocatedAtPercentage
						countAsOverallocatedAtPercentage
						...editAssignmentRoleButton_AssignmentRoleFragment
						...AssignmentRoleSortOrderButtons_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;

export const SET_ASSIGNMENT_ROLE_SORT_ORDERS = graphql`
	mutation assignmentRolesTable_SetAssignmentRoleSortOrderMutation(
		$input: SetAssignmentRoleSortOrdersInput!
	) {
		Assignment {
			setAssignmentRoleSortOrders(input: $input) {
				edges {
					node {
						...editAssignmentRoleButton_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;
