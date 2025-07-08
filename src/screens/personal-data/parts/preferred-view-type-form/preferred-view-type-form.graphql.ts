import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment preferredViewTypeForm_CurrentUser on Query {
		Viewer {
			Auth {
				currentUser {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								preferredViewType
							}
						}
					}
				}
			}
		}
	}
`;

export const SET_PREFERRED_VIEW_TYPE_MUTATION = graphql`
	mutation preferredViewTypeForm_SetPreferredViewTypeMutation(
		$input: SetPreferredViewTypeInput!
	) {
		Admin {
			Auth {
				setPreferredViewType(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;
