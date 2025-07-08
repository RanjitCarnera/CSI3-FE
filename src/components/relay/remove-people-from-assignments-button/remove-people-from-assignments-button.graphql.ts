import { graphql } from "babel-plugin-relay/macro";

export const DELETE_MUTATION = graphql`
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
