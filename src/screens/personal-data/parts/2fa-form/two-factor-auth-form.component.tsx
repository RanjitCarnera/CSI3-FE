import React from "react";
import { useDispatch } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { type twoFactorAuthForm_Disable2FAMutation } from "@relay/twoFactorAuthForm_Disable2FAMutation.graphql";
import type { twoFactorAuthForm_QueryFragment$key } from "@relay/twoFactorAuthForm_QueryFragment.graphql";
import { AuthenticatorAppSlot } from "@screens/personal-data/parts/2fa-form/parts/authenticator-app-slot";
import { RecoveryCodesSlot } from "@screens/personal-data/parts/2fa-form/parts/recovery-codes-slot";
import {
	DISABLE_2FA_MUTATION,
	QUERY_FRAGMENT,
} from "@screens/personal-data/parts/2fa-form/two-factor-auth-form.graphql";
import { type TwoFactorAuthFormProps } from "@screens/personal-data/parts/2fa-form/two-factor-auth-form.types";

export const TwoFactorAuthForm = ({ queryFragmentRef }: TwoFactorAuthFormProps) => {
	const query = useFragment<twoFactorAuthForm_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragmentRef,
	);

	const [disable2FA] = useMutation<twoFactorAuthForm_Disable2FAMutation>(DISABLE_2FA_MUTATION);
	const dispatch = useDispatch();

	return (
		<div>
			<h3>Two-factor methods</h3>
			<AuthenticatorAppSlot queryFragment={query} />
			<hr />
			<div>More coming soon...</div>
			<h3>Recovery Options</h3>
			<RecoveryCodesSlot queryFragment={query} />
		</div>
	);
};
