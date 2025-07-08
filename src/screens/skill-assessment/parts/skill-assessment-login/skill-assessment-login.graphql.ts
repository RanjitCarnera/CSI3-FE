import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessmentLogin_Query($accountId: ID!) {
		Assessment {
			AccountLogo(accountId: $accountId) {
				url
			}
		}
	}
`;

export const LOGIN_TO_ASSESSMENT_MUTATION = graphql`
	mutation skillAssessmentLogin_LoginToAssessmentMutation($input: LoginToAssessmentInput!) {
		Assessment {
			loginToAssessment(input: $input) {
				password
			}
		}
	}
`;
