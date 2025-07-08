import { graphql } from "babel-plugin-relay/macro";

export const EXPORT_ASSIGNMENT_ROLES_MUTATION = graphql`
	mutation exportAssignmentRolesButton_ExportAssignmentRolesMutation {
		Assignment {
			exportAssignmentRoles(input: {}) {
				file {
					url
				}
			}
		}
	}
`;
