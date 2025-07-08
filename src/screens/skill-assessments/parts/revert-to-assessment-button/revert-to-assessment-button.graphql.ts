import { graphql } from "babel-plugin-relay/macro";

export const ASSESSMENT_FRAGMENT = graphql`
	fragment revertToAssessmentButton_AssessmentFragment on Assessment {
		id
		person {
			id
		}
		...revertToAssessmentForm_AssessmentFragment
	}
`;

export const REVERT_TO_ASSESSMENT_MUTATION = graphql`
	mutation revertToAssessmentButton_RevertToAssessmentMutation($input: RevertToAssessmentInput!) {
		Admin {
			Assessment {
				revertToAssessment(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;
