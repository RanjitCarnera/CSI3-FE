import { graphql } from "babel-plugin-relay/macro";

export const ASSIGNMENT_ROLE_FRAGMENT = graphql`
	fragment editAssignmentRoleButton_AssignmentRoleFragment on AssignmentRole {
		id
		name
		sortOrder
		maxNumberOfProjects
		utilizationProjectionCapInMonths
		countAsFullyAllocatedAtPercentage
		countAsOverallocatedAtPercentage
		useEndDateOfLastAssignmentOverProjectionCap
		cucTemplate {
			id
		}
	}
`;

export const EDIT_ASSIGNMENT_ROLE_MUTATION = graphql`
	mutation editAssignmentRoleButton_EditAssignmentRoleMutation($input: EditAssignmentRoleInput!) {
		Assignment {
			editAssignmentRole(input: $input) {
				edge {
					node {
						id
						...editAssignmentRoleButton_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;
