import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type PermissionBasedNavigation_CurrentUser$data } from "@relay/PermissionBasedNavigation_CurrentUser.graphql";
import { type Permission } from "@relay/PermissionsField_Query.graphql";
import { type ReduxState } from "../Store";

export type CurrentUserData = Writable<PermissionBasedNavigation_CurrentUser$data>;

export interface CurrentUserState {
	currentUser?: PermissionBasedNavigation_CurrentUser$data;
}

const INITIAL_STATE: CurrentUserState = {};

const currentUserSlice = createSlice({
	name: "current-user",
	initialState: INITIAL_STATE,
	reducers: {
		setCurrentUser: (state, action: PayloadAction<CurrentUserData>) => {
			state.currentUser = action.payload;
		},
		updateExtension: (
			state: Writable<CurrentUserState>,
			action: PayloadAction<Writable<Partial<CurrentUserData["user"]["extension"]>>>,
		) => {
			if (!state.currentUser) return;
			state.currentUser.user.extension = {
				...state.currentUser.user.extension,
				...action.payload,
			};
		},
	},
});

export const { setCurrentUser, updateExtension } = currentUserSlice.actions;
export const CurrentUserSliceReducer = currentUserSlice.reducer;

const selectCurrentUserSlice = (state: ReduxState) => state.currentUser;

export const selectCurrentUser = createSelector(selectCurrentUserSlice, (e) => e.currentUser);

export const selectPermissionsInAccount = createSelector(
	selectCurrentUserSlice,
	(state) => state.currentUser?.permissionsInAccount || [],
);

const checkPermissions = (
	permissions: readonly Permission[],
	necessaryPermissions: Permission[],
	ownerSuffices: boolean,
) => {
	const necessaryButCanBeReplacedByOwner = necessaryPermissions.filter((p) => {
		return !(
			[
				"AccountPermission_Auth_Field",
				"AccountPermission_Auth_Reports",
				"AccountPermission_System_Root",
				"AccountPermission_Auth_GapDaysEnabled",
				"AccountPermission_Auth_DriveTimesEnabled",
			] as Permission[]
		).includes(p);
	});

	const otherPermissions = necessaryPermissions.filter(
		(p) => !necessaryButCanBeReplacedByOwner.includes(p),
	);

	const hasAllPermissionsWhereOwnerSuffices =
		necessaryButCanBeReplacedByOwner.filter((p) => permissions.includes(p)).length ===
			necessaryButCanBeReplacedByOwner.length ||
		permissions.includes("UserInAccountPermission_System_Owner");
	const hasAllOtherPermissions =
		otherPermissions.filter((p) => permissions.includes(p)).length === otherPermissions.length;

	if (ownerSuffices) return hasAllPermissionsWhereOwnerSuffices && hasAllOtherPermissions;
	return (
		necessaryPermissions.filter((p) => permissions.includes(p)).length ===
		necessaryPermissions.length
	);
};

export const selectHasStrictPermissions = createSelector(
	selectPermissionsInAccount,
	(permissionsInAccount) => {
		return (necessaryPermissions: Permission[]) =>
			checkPermissions(permissionsInAccount ?? [], necessaryPermissions, false);
	},
);

export const selectHasPermissions = createSelector(
	selectPermissionsInAccount,
	(permissionsInAccount) => {
		return (necessaryPermissions: Permission[]) =>
			checkPermissions(permissionsInAccount ?? [], necessaryPermissions, true);
	},
);
export const selectBudgetDisplay = createSelector(
	selectCurrentUser,
	(state) => state?.user.extension?.budgetDisplay,
);
export const selectAccountMetaNameByBase64DecodedAccountId = createSelector(
	selectCurrentUserSlice,
	(e) => (id: string) =>
		e.currentUser?.accounts.find((a) => atob(a.id).includes(id))?.name || "Account Not Found",
);
