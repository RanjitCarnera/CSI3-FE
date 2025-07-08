import { graphql } from "babel-plugin-relay/macro";

export const LOGIN_2FA_MUTATION = graphql`
	mutation twoFactorAuthOtp_login2FAMutation($input: Login2FAInput!) {
		Auth {
			login2FA(input: $input) {
				jwtTokens {
					accessToken
					refreshToken
				}
			}
		}
	}
`;
