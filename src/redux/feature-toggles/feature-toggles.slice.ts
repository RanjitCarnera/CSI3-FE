import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type FeatureId } from "@relay/PermissionBasedNavigation_Query.graphql";
import { type ReduxState } from "../../Store";

interface State {
	activeFeatureToggleIds: FeatureId[];
}

const INITIAL_STATE: State = {
	activeFeatureToggleIds: [],
};

const slice = createSlice({
	name: "feature-toggles",
	initialState: INITIAL_STATE,
	reducers: {
		set: (state, action: PayloadAction<FeatureId[]>) => {
			state.activeFeatureToggleIds = action.payload;
		},
		clear: (state) => {
			state.activeFeatureToggleIds = [];
		},
	},
});

export const { set: setActiveFeatureToggleIds, clear: clearActiveFeatureToggleIds } = slice.actions;
export const FeatureTogglesReducer = slice.reducer;

const selectSlice = (state: ReduxState) => state.featureToggles;

export const selectActiveFeatureToggleIds = createSelector(
	selectSlice,
	(state) => state.activeFeatureToggleIds,
);
