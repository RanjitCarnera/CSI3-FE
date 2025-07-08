import { graphql } from "babel-plugin-relay/macro";

export const DELETE_ASSIGNMENT_ROLE_MUTATION = graphql`
	mutation deleteAssignmentRolesButton_DeleteAssignmentRoleMutation(
		$input: DeleteAssignmentRoleInput!
		$connections: [ID!]!
	) {
		Assignment {
			deleteAssignmentRole(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;
