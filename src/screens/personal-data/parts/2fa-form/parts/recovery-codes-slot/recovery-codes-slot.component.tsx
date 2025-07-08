import { readInlineData, useFragment, useMutation } from "react-relay";
import { useNavigate } from "react-router-dom";
import { type recoveryCodesSlot_GenerateRecoveryCodeCredentialsMutation } from "@relay/recoveryCodesSlot_GenerateRecoveryCodeCredentialsMutation.graphql";
import { type recoveryCodesSlot_QueryFragment$key } from "@relay/recoveryCodesSlot_QueryFragment.graphql";
import {
	type recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment$data,
	type recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment$key,
} from "@relay/recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment.graphql";
import { recoveryCodesSlotTranslations } from "@screens/personal-data/parts/2fa-form/parts/recovery-codes-slot/recovery-codes-slot.const";
import {
	GENERATE_RECOVERY_CODES_MUTATION,
	QUERY_FRAGMENT,
	RECOVERY_CODE_CREDENTIALS_INLINE_FRAGMENT,
} from "@screens/personal-data/parts/2fa-form/parts/recovery-codes-slot/recovery-codes-slot.graphql";
import { type RecoveryCodesSlotProps } from "@screens/personal-data/parts/2fa-form/parts/recovery-codes-slot/recovery-codes-slot.types";
import { getBadges } from "@screens/personal-data/parts/2fa-form/parts/recovery-codes-slot/recovery-codes-slot.utils";
import { Slot } from "@screens/personal-data/parts/2fa-form/parts/slot/slot.component";
import {
	type SlotAction,
	type SlotBadge,
} from "@screens/personal-data/parts/2fa-form/parts/slot/slot.types";
import { RECOVERY_CODES_SCREEN_PATH } from "@screens/recovery-codes/recovery-codes.screen";

export const RecoveryCodesSlot = ({ queryFragment }: RecoveryCodesSlotProps) => {
	const query = useFragment<recoveryCodesSlot_QueryFragment$key>(QUERY_FRAGMENT, queryFragment);
	const credentials =
		readInlineData<recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment$key>(
			RECOVERY_CODE_CREDENTIALS_INLINE_FRAGMENT,
			query.Viewer.Auth?.recoveryCodeCredentials,
		) ?? undefined;
	const hasActivated2FAToken = query.Viewer.Auth.twoFactorAuthToken?.data.isActivated ?? false;
	const [generateRecoveryCodes] =
		useMutation<recoveryCodesSlot_GenerateRecoveryCodeCredentialsMutation>(
			GENERATE_RECOVERY_CODES_MUTATION,
		);
	const navigate = useNavigate();
	const getActions = (
		data?: recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment$data,
	): SlotAction[] => {
		const viewLabel: SlotAction = {
			onClick: () => {
				navigate(RECOVERY_CODES_SCREEN_PATH);
			},
			label: "View",
		};
		const generateLabel: SlotAction = {
			onClick: () => {
				generateRecoveryCodes({
					variables: {
						input: {},
					},
					onCompleted: () => {
						window.location.href = RECOVERY_CODES_SCREEN_PATH;
					},
				});
			},
			label: "Generate",
			isDisabled: !hasActivated2FAToken,
		};
		return data ? [viewLabel] : [generateLabel];
	};

	const badges: SlotBadge[] = getBadges(credentials);
	const actions: SlotAction[] = getActions(credentials);
	return (
		<Slot
			icon={"pi pi-key"}
			title={recoveryCodesSlotTranslations.title}
			subtitle={recoveryCodesSlotTranslations.subtitle}
			badges={badges}
			actions={actions}
		/>
	);
};
