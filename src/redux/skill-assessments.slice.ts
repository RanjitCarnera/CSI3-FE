import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxState } from "../Store";

export interface SkillAssessmentsFilters {
	filterByName?: string;
}

export interface SkillAssessmentsState {
	filters: SkillAssessmentsFilters;
}

const INITIAL_STATE: SkillAssessmentsState = {
	filters: {},
};

const skillAssessmentsSlice = createSlice({
	name: "skill-assessments",
	initialState: INITIAL_STATE,
	reducers: {
		setSkillAssessmentsFilters: (state, action: PayloadAction<SkillAssessmentsFilters>) => {
			state.filters = action.payload;
		},
		clearSkillAssessmentsFilters: (state) => {
			state.filters = {};
		},
	},
});

export const { setSkillAssessmentsFilters, clearSkillAssessmentsFilters } =
	skillAssessmentsSlice.actions;
export const SkillAssessmentSliceReducer = skillAssessmentsSlice.reducer;

const selectSkillAssessmentsSlice = (state: ReduxState) => state.skillAssessments;

export const selectSkillAssessmentsFilters = createSelector(
	selectSkillAssessmentsSlice,
	(state) => state.filters,
);
