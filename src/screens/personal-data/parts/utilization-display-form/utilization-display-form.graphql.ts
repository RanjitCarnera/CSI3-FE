import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment utilizationDisplayForm_QueryFragment on Query {
		Viewer {
			Auth {
				currentUser {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								utilizationDisplay
							}
						}
					}
				}
			}
		}
	}
`;

export const SET_UTILIZATION_DISPLAY_SETTING_MUTATION = graphql`
	mutation utilizationDisplayForm_setUtilizationDisplaySettingMutation(
		$input: SetUtilizationDisplaySettingInput!
	) {
		Admin {
			Auth {
				setUtilizationDisplaySetting(input: $input) {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								utilizationDisplay
							}
						}
					}
					clientMutationId
				}
			}
		}
	}
`;
