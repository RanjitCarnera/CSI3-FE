import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment recoveryCodesSlot_QueryFragment on Query {
		Viewer {
			Auth {
				recoveryCodeCredentials {
					...recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment
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
export const RECOVERY_CODE_CREDENTIALS_INLINE_FRAGMENT = graphql`
	fragment recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment on RecoveryCodeCredentials
	@inline {
		id
		data {
			credentials
		}
	}
`;
export const GENERATE_RECOVERY_CODES_MUTATION = graphql`
	mutation recoveryCodesSlot_GenerateRecoveryCodeCredentialsMutation(
		$input: GenerateRecoveryCodeCredentialsInput!
	) {
		Auth {
			generateRecoveryCodeCredentials(input: $input) {
				clientMutationId
				recoveryCodeCredentials {
					...recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment
				}
			}
		}
	}
`;
