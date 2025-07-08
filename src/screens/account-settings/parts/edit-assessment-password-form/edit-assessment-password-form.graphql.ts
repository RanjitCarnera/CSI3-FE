import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment editAssessmentPasswordForm_QueryFragment on Query {
		Viewer {
			Auth {
				currentAccount {
					extensions {
						kind
						... on AssessmentAccountExtension {
							kind
							password
						}
					}
				}
			}
		}
	}
`;
export const SET_PASSWORD_MUTATION = graphql`
	mutation editAssessmentPasswordForm_SetAccountAssessmentPasswordMutation(
		$input: SetAccountAssessmentPasswordInput!
	) {
		Admin {
			Auth {
				setAccountAssessmentPassword(input: $input) {
					account {
						id
					}
				}
			}
		}
	}
`;
