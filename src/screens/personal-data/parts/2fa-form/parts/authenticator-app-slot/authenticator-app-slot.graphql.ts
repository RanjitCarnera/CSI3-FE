import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment authenticatorAppSlot_QueryFragment on Query {
		Viewer {
			Auth {
				twoFactorAuthToken {
					...authenticatorAppSlot_TwoFactorAuthTokenInlineFragment
				}
			}
		}
	}
`;
export const TWO_FACTOR_AUTH_TOKEN_INLINE_FRAGMENT = graphql`
	fragment authenticatorAppSlot_TwoFactorAuthTokenInlineFragment on TwoFactorAuthToken @inline {
		id
		data {
			isActivated
			activatedAt
		}
	}
`;
export const SETUP_TWO_FACTOR_AUTH_MUTATION = graphql`
	mutation authenticatorAppSlot_SetupTwoFactorAuthMutation($input: SetupTwoFactorAuthInput!) {
		Auth {
			setupTwoFactorAuth(input: $input) {
				twoFactorAuthToken {
					...authenticatorAppSlot_TwoFactorAuthTokenInlineFragment
				}
			}
		}
	}
`;
export const DISABLE_2FA_MUTATION = graphql`
	mutation authenticatorAppSlot_Disable2FAMutation($input: Disable2FAInput!) {
		Auth {
			disable2FA(input: $input) {
				clientMutationId
			}
		}
	}
`;
