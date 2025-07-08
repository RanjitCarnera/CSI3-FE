import { type twoFactorAuthForm_QueryFragment$key } from "@relay/twoFactorAuthForm_QueryFragment.graphql";

export interface TwoFactorAuthFormProps {
	queryFragmentRef: twoFactorAuthForm_QueryFragment$key;
}

export interface TwoFactorAuthFormState {
	has2FAEnabled: boolean;
}
