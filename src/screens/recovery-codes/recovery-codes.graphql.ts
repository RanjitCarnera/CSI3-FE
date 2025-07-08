import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query recoveryCodesScreen_Query {
		Viewer {
			Auth {
				recoveryCodeCredentials {
					...recoveryCodesScreen_RecoveryCodeCredentialsInlineFragment
				}
				twoFactorAuthToken {
					data {
						isActivated
					}
				}
			}
		}
	}
`;

export const GENERATE_RECOVERY_CODES_MUTATION = graphql`
	mutation recoveryCodesScreen_GenerateRecoveryCodeCredentialsMutation(
		$input: GenerateRecoveryCodeCredentialsInput!
	) {
		Auth {
			generateRecoveryCodeCredentials(input: $input) {
				clientMutationId
				recoveryCodeCredentials {
					...recoveryCodesScreen_RecoveryCodeCredentialsInlineFragment
				}
			}
		}
	}
`;

export const RECOVERY_CODE_CREDENTIALS_INLINE_FRAGMENT = graphql`
	fragment recoveryCodesScreen_RecoveryCodeCredentialsInlineFragment on RecoveryCodeCredentials
	@inline {
		id
		data {
			credentials
		}
	}
`;
