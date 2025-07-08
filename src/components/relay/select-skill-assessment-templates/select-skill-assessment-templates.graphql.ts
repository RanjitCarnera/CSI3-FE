import { graphql } from "babel-plugin-relay/macro";

export const ASSESSMENT_TEMPLATES_QUERY = graphql`
	query selectSkillAssessmentTemplates_AssessmentTemplatesQuery($accountId: ID!) {
		Assessment {
			AssessmentTemplates(accountId: $accountId, first: 20) {
				edges {
					node {
						name
						id
					}
				}
			}
		}
	}
`;
