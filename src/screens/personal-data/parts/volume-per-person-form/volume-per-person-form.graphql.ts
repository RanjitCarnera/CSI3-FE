import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment volumePerPersonForm_CurrentUser on Query {
		Viewer {
			Auth {
				currentUser {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								showVolumePerPerson
							}
						}
					}
				}
			}
		}
	}
`;

export const CHANGE_VOLUME_PER_PERSON_MUTATION = graphql`
	mutation volumePerPersonForm_ChangeVolumePerPersonMutation(
		$input: SetShowVolumePerPersonInput!
	) {
		Admin {
			Auth {
				setShowVolumePerPerson(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;
