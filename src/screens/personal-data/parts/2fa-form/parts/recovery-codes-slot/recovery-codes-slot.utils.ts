import { type recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment$data } from "@relay/recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment.graphql";
import type { SlotBadge } from "@screens/personal-data/parts/2fa-form/parts/slot/slot.types";

export const getBadges = (
	data?: recoveryCodesSlot_RecoveryCodeCredentialsInlineFragment$data,
): SlotBadge[] => {
	const configuredBadge: SlotBadge = { label: "Congigured", severity: "success" };
	const notConfiguredBadge: SlotBadge = { label: "Setup", severity: "warning" };
	return data ? [configuredBadge] : [notConfiguredBadge];
};
