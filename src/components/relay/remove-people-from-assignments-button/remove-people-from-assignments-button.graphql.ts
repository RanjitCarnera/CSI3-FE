import { graphql } from "babel-plugin-relay/macro";

export const UNASSIGN_MUTATION = graphql`
	mutation removePeopleFromAssignmentsButton_DeleteMutation(
		$input: UnassignAllPeopleFromProjectInput!
	) {
		Project {
			unassignAllPeopleFromProject(input: $input) {
				assignmentUpdates {
					project {
						id
						...projectCard_ProjectFragment
					}
				}
				clientMutationId
			}
		}
	}
`;

export const DELETE_MUTATION = graphql`
	mutation removePeopleFromAssignmentsButton_deleteAllAssignmentsFromProjectInScenarioMutation(
		$input: DeleteAllAssignmentsFromProjectInScenarioInput!
	) {
		Project {
			deleteAllAssignmentsFromProjectInScenario(input: $input) {
				assignmentUpdates {
					project {
						id
						...projectCard_ProjectFragment
					}
				}
				clientMutationId
			}
		}
	}
`;
