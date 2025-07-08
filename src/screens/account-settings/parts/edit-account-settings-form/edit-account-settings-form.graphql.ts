import { graphql } from "babel-plugin-relay/macro";

export const SET_ACCOUNT_SETTINGS_MUTATION = graphql`
	mutation editAccountSettingsForm_SetAccountSettingsMutation($input: SetForce2FAInput!) {
		Admin {
			Auth {
				setForce2FA(input: $input) {
					account {
						extensions {
							... on TwoFAAccountExtension {
								force2FA
							}
						}
					}
					clientMutationId
				}
			}
		}
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment editAccountSettingsForm_QueryFragment on Query {
		Viewer {
			Auth {
				currentAccount {
					extensions {
						kind
						... on TwoFAAccountExtension {
							kind
							force2FA
						}
					}
				}
			}
		}
	}
`;
