import { readInlineData, useFragment, useMutation } from "react-relay";
import { useNavigate } from "react-router-dom";
import { type authenticatorAppSlot_Disable2FAMutation } from "@relay/authenticatorAppSlot_Disable2FAMutation.graphql";
import { type authenticatorAppSlot_QueryFragment$key } from "@relay/authenticatorAppSlot_QueryFragment.graphql";
import { type authenticatorAppSlot_SetupTwoFactorAuthMutation } from "@relay/authenticatorAppSlot_SetupTwoFactorAuthMutation.graphql";
import {
	type authenticatorAppSlot_TwoFactorAuthTokenInlineFragment$data,
	type authenticatorAppSlot_TwoFactorAuthTokenInlineFragment$key,
} from "@relay/authenticatorAppSlot_TwoFactorAuthTokenInlineFragment.graphql";
import { ACTIVATE_2FA_SCREEN } from "@screens/activate-2fa/activate-2fa.screen";
import { authenticatorAppSlotTranslations } from "@screens/personal-data/parts/2fa-form/parts/authenticator-app-slot/authenticator-app-slot.consts";
import {
	DISABLE_2FA_MUTATION,
	QUERY_FRAGMENT,
	SETUP_TWO_FACTOR_AUTH_MUTATION,
	TWO_FACTOR_AUTH_TOKEN_INLINE_FRAGMENT,
} from "@screens/personal-data/parts/2fa-form/parts/authenticator-app-slot/authenticator-app-slot.graphql";
import { type AuthenticatorAppSlotProps } from "@screens/personal-data/parts/2fa-form/parts/authenticator-app-slot/authenticator-app-slot.types";
import { Slot } from "@screens/personal-data/parts/2fa-form/parts/slot/slot.component";
import {
	type SlotAction,
	type SlotBadge,
} from "@screens/personal-data/parts/2fa-form/parts/slot/slot.types";

export const AuthenticatorAppSlot = ({ queryFragment }: AuthenticatorAppSlotProps) => {
	const query = useFragment<authenticatorAppSlot_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragment,
	);
	const navigate = useNavigate();
	const token =
		readInlineData<authenticatorAppSlot_TwoFactorAuthTokenInlineFragment$key>(
			TWO_FACTOR_AUTH_TOKEN_INLINE_FRAGMENT,
			query.Viewer.Auth?.twoFactorAuthToken,
		) ?? undefined;
	const [setup] = useMutation<authenticatorAppSlot_SetupTwoFactorAuthMutation>(
		SETUP_TWO_FACTOR_AUTH_MUTATION,
	);
	const [disabledTwoFactorAuth] =
		useMutation<authenticatorAppSlot_Disable2FAMutation>(DISABLE_2FA_MUTATION);
	const getActions = (
		data?: authenticatorAppSlot_TwoFactorAuthTokenInlineFragment$data,
	): SlotAction[] => {
		const setupAction: SlotAction = {
			onClick: () => {
				setup({
					variables: { input: {} },
					onCompleted: (response) => {
						window.location.href = ACTIVATE_2FA_SCREEN;
					},
				});
			},
			label: "Setup",
		};
		const deleteAction: SlotAction = {
			onClick: () => {
				disabledTwoFactorAuth({
					variables: {
						input: {},
					},
					onCompleted: () => {
						window.location.reload();
					},
				});
			},
			label: "Delete",
		};
		const activateAction: SlotAction = {
			onClick: () => {
				navigate(ACTIVATE_2FA_SCREEN);
			},
			label: "Activate",
		};
		if (!data) return [setupAction];
		if (!data.data.isActivated) return [activateAction, deleteAction];
		return [deleteAction];
	};

	const badges: SlotBadge[] = getBadges(token);
	const actions: SlotAction[] = getActions(token);

	return (
		<>
			<Slot
				icon={"pi pi-phone"}
				title={authenticatorAppSlotTranslations.title}
				subtitle={authenticatorAppSlotTranslations.subtitle}
				badges={badges}
				actions={actions}
			/>
		</>
	);
};

const getBadges = (
	data?: authenticatorAppSlot_TwoFactorAuthTokenInlineFragment$data,
): SlotBadge[] => {
	const configuredBadge: SlotBadge = { label: "Configured", severity: "success" };
	const notActivatedBadge: SlotBadge = { label: "Not activated", severity: "warning" };
	const notSetupBadge: SlotBadge = { label: "Not setup", severity: "info" };
	if (data?.data.isActivated) return [configuredBadge];
	if (data?.data.isActivated === false) return [notActivatedBadge];
	return [notSetupBadge];
};
