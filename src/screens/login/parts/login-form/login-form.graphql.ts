import graphql from "babel-plugin-relay/macro";

export const LOGIN_MUTATION = graphql`
	mutation loginForm_LoginMutation($input: LoginJwtInput!) {
		Auth {
			loginJwt(input: $input) {
				status {
					kind
					... on TwoFactorAuthRequired {
						qrCodeUri
						userName
						password
						email
					}
					... on twoFactorAuthCredentialsIncorrect {
						email
						password
						userName
					}
					... on authCredentialsCorrect {
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

export const EMAIL_HAS_AZURE_AD_SSO_SETUP_MUTATION = graphql`
	mutation loginForm_EmailHasAzureADSSOSetupMutation($input: EmailHasAzureAdSsoSetupInput!) {
		AuthAzureAd {
			emailHasAzureAdSsoSetup(input: $input) {
				hasSetup
			}
		}
	}
`;

export const LOGIN_AZURE_AD_USER_MUTATION = graphql`
	mutation loginForm_LoginAzureAdUserMutation(
		$input: LoginAzureAdUserWithHarkinsUserExtensionInput!
	) {
		Sso {
			loginAzureAdUserWithHarkinsUserExtension(input: $input) {
				jwtTokens {
					accessToken
					refreshToken
				}
			}
		}
	}
`;

export const GET_AZURE_AD_AUTHENTICATION_URL_FOR_EMAIL = graphql`
	mutation loginForm_GetAzureAdAuthenticationUrlForEmailMutation(
		$input: GetAzureAdAuthenticationUrlForEmailInput!
	) {
		AuthAzureAd {
			getAzureAdAuthenticationUrlForEmail(input: $input) {
				redirectUri
			}
		}
	}
`;
