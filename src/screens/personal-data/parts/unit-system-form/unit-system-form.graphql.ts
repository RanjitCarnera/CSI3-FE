import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment unitSystemForm_QueryFragment on Query {
		Viewer {
			Auth {
				currentUser {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								budgetDisplay
								showVolumePerPerson
								unitSystem
							}
						}
					}
				}
			}
		}
	}
`;

export const SET_UNIT_SYSTEM_MUTATION = graphql`
	mutation unitSystemForm_SetUnitSystemMutation($input: SetUnitSystemInput!) {
		Admin {
			Auth {
				setUnitSystem(input: $input) {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								unitSystem
							}
						}
					}
					clientMutationId
				}
			}
		}
	}
`;
