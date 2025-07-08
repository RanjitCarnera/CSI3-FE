import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment twoFactorAuthForm_QueryFragment on Query {
		Viewer {
			Auth {
				twoFactorAuthToken {
					id
					createdAt
					data {
						isActivated
					}
				}
			}
		}
		...authenticatorAppSlot_QueryFragment
		...recoveryCodesSlot_QueryFragment
	}
`;

export const DISABLE_2FA_MUTATION = graphql`
	mutation twoFactorAuthForm_Disable2FAMutation($input: Disable2FAInput!) {
		Auth {
			disable2FA(input: $input) {
				clientMutationId
			}
		}
	}
`;
