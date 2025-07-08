import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query activate2fa_Query {
		Viewer {
			Auth {
				twoFactorAuthToken {
					id
					createdAt
					data {
						qrCodeUri
						isActivated
						activatedAt
						secretKey
					}
				}
			}
		}
	}
`;

export const ACTIVATE_2FA_MUTATION = graphql`
	mutation activate2fa_Activate2FAMutation($input: Activate2FAInput!) {
		Auth {
			activate2FA(input: $input) {
				clientMutationId
			}
		}
	}
`;
