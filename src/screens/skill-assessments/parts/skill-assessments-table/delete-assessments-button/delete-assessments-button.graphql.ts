import { graphql } from "babel-plugin-relay/macro";

export const DELETE_ASSESSMENTS_MUTATION = graphql`
	mutation deleteAssessmentsButton_DeleteAssessmentMutation(
		$input: DeleteAssessmentInput!
		$connections: [ID!]!
	) {
		Admin {
			Assessment {
				deleteAssessment(input: $input) {
					deletedIds @deleteEdge(connections: $connections)
				}
			}
		}
	}
`;
