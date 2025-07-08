import { graphql } from "babel-plugin-relay/macro";

export const CREATE_ASSIGNMENT_ROLE_MUTATION = graphql`
	mutation createAssignmentRoleButton_CreateAssignmentRoleMutation(
		$input: CreateAssignmentRoleInput!
		$connectionId: ID!
	) {
		Assignment {
			createAssignmentRole(input: $input) {
				edge @appendEdge(connections: [$connectionId]) {
					node {
						id
						...editAssignmentRoleButton_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;
