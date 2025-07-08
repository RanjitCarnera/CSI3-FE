import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessment_Query(
		$accountId: ID!
		$password: String
		$personId: ID
		$templateId: ID
	) {
		Assessment {
			AccountLogo(accountId: $accountId) {
				url
			}
		}
		...skillAssessment_GetLastUpdatedDateQuery
			@arguments(
				accountId: $accountId
				password: $password
				personId: $personId
				templateId: $templateId
			)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment skillAssessment_GetLastUpdatedDateQuery on Query
	@refetchable(queryName: "skillAssessment_Refetch")
	@argumentDefinitions(
		accountId: { type: "ID!" }
		password: { type: "String" }
		personId: { type: "ID" }
		templateId: { type: "ID" }
	) {
		Assessment {
			GetContinueFromDate(
				accountId: $accountId
				password: $password
				personId: $personId
				templateId: $templateId
			) @connection(key: "skillAssessment_GetContinueFrom")
		}
	}
`;

export const START_ASSESSMENT_MUTATION = graphql`
	mutation skillAssessment_StartAssessmentMutation($input: StartAssessmentInput!) {
		Assessment {
			startAssessment(input: $input) {
				assessment {
					id
				}
			}
		}
	}
`;
