import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_ASSIGNMENT_ROLES_MUTATION = graphql`
	mutation importAssignmentRolesButton_ImportAssignmentRolesMutation(
		$input: ImportAssignmentRolesInput!
	) {
		Assignment {
			importAssignmentRoles(input: $input) {
				result {
					editedEntities
					newEntities
					issues {
						row
						issue
					}
				}
			}
		}
	}
`;
