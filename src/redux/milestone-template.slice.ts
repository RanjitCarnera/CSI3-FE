import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReduxState } from "../Store";

export interface MilestoneTemplateFilters {
	name: string;
}

export interface MilestoneTemplateState {
	filters: MilestoneTemplateFilters;
}

const INITIAL_STATE: MilestoneTemplateState = {
	filters: {
		name: "",
	},
};

const slice = createSlice({
	name: "milestoneTemplates",
	initialState: INITIAL_STATE,
	reducers: {
		setFilters: (state, action: PayloadAction<MilestoneTemplateFilters>) => {
			state.filters = action.payload;
		},
		clearFilters: (state) => {
			state.filters = INITIAL_STATE.filters;
		},
	},
});

export const {
	setFilters: setMilestoneTemplateFilters,
	clearFilters: clearMilestoneTemplateFilters,
} = slice.actions;
export const MilestoneTemplateSliceReducer = slice.reducer;

const selectMilestoneTemplateSlice = (state: ReduxState) => state.milestoneTemplates;

export const selectMilestoneTemplateFilters = createSelector(
	selectMilestoneTemplateSlice,
	(state) => state.filters,
);
