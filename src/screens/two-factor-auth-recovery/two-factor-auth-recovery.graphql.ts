import { graphql } from "babel-plugin-relay/macro";

export const TWO_FACTOR_AUTH_RECOVERY_MUTATION = graphql`
	mutation twoFactorAuthRecovery_TwoFactorAuthRecoveryMutation(
		$input: Login2FARecoveryCodeInput!
	) {
		Auth {
			login2FARecoveryCode(input: $input) {
				status {
					kind
					... on authCredentialsCorrect {
						kind
						jwtTokens {
							refreshToken
							accessToken
						}
					}
				}
			}
		}
	}
`;
