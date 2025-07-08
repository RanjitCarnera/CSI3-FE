import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessmentSuccess_AssessmentNodeQuery($accountId: ID!, $id: ID!, $password: String) {
		Assessment {
			MyAssessment(accountId: $accountId, assessmentId: $id, password: $password) {
				id
				person {
					name
				}
				template {
					name
				}
			}
		}
	}
`;
