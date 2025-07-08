import { graphql } from "babel-plugin-relay/macro";

export const WRITE_ASSIGNMENTS_TO_DYNAMICS_MUTATION = graphql`
	mutation writeAssignmentsToDynamicsButton_WriteMutation(
		$input: WriteAssignmentsToDynamicsInput!
	) {
		Dynamics {
			writeAssignmentsToDynamics(input: $input) {
				clientMutationId
			}
		}
	}
`;
