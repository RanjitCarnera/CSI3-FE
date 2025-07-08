import { graphql } from "babel-plugin-relay/macro";

export const UPDATE_ASSIGMENT_MUTATION = graphql`
	mutation resizeAssignmentDialogue_UpdateAssigmentMutation($input: EditAssignmentInput!) {
		Scenario {
			editAssignment(input: $input) {
				clientMutationId
			}
		}
	}
`;
