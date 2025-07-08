import { graphql } from "babel-plugin-relay/macro";

export const EDIT_NUMERICAL_EXPLANATIONS_MUTATION = graphql`
	mutation editNumericalDimensionExplanationsForm_EditNumericalDimensionExplanationsMutation(
		$input: EditNumericalDimensionExplanationsInput!
	) {
		Admin {
			Auth {
				editNumericalDimensionExplanations(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment editNumericalDimensionExplanationsForm_QueryFragment on Query {
		Viewer {
			Auth {
				currentAccount {
					extensions {
						kind
						... on AccountSettingsAccountExtension {
							kind
							numericalDimensionExplanations
						}
					}
				}
			}
		}
	}
`;
