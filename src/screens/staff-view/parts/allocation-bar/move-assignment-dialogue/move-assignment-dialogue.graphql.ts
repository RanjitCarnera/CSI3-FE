import { graphql } from "babel-plugin-relay/macro";

export const UPDATE_ASSIGMENT_MUTATION = graphql`
	mutation moveAssignmentDialogue_UpdateAssigmentMutation($input: EditAssignmentInput!) {
		Scenario {
			editAssignment(input: $input) {
				clientMutationId
			}
		}
	}
`;
