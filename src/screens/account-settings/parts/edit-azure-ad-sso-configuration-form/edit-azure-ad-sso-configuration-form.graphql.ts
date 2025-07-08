import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment editAzureAdSsoConfigurationForm_QueryFragment on Query {
		Viewer {
			Auth {
				currentAccount {
					extensions {
						kind
						... on TwoFAAccountExtension {
							force2FA
							kind
						}
						... on AuthProviderAccountExtension {
							kind
							authProviders {
								... on AzureAdAuthProvider {
									isActivated
									applicationId
									authorityUrl
									domain
									tenantId
									secret
									kind
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const SET_AZURE_AD_SSO_CONFIGURATION_MUTATION = graphql`
	mutation editAzureAdSsoConfigurationForm_SetAzureAdSsoConfigurationMutation(
		$input: SetAzureAdSsoConfigurationInput!
	) {
		Auth {
			setAzureAdSsoConfiguration(input: $input) {
				account {
					extensions {
						... on AuthProviderAccountExtension {
							authProviders {
								... on AzureAdAuthProvider {
									isActivated
									applicationId
									authorityUrl
									domain
									tenantId
									secret
									kind
								}
							}
						}
					}
				}
			}
		}
	}
`;
