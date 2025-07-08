import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxState } from "../Store";

export interface SkillAssessmentTemplatesFilters {
	filterByName?: string;
}

export interface SkillAssessmentTemplatesState {
	filters: SkillAssessmentTemplatesFilters;
}

const INITIAL_STATE: SkillAssessmentTemplatesState = {
	filters: {},
};

const skillAssessmentTemplatesSlice = createSlice({
	name: "skill-assessments-templates",
	initialState: INITIAL_STATE,
	reducers: {
		setSkillAssessmentTemplatesFilters: (
			state,
			action: PayloadAction<SkillAssessmentTemplatesFilters>,
		) => {
			state.filters = action.payload;
		},
		clearSkillAssessmentTemplatesFilters: (state) => {
			state.filters = {};
		},
	},
});

export const { setSkillAssessmentTemplatesFilters, clearSkillAssessmentTemplatesFilters } =
	skillAssessmentTemplatesSlice.actions;
export const SkillAssessmentTemplatesSliceReducer = skillAssessmentTemplatesSlice.reducer;

const selectSkillAssessmentTemplatesSlice = (state: ReduxState) => state.skillAssessmentTemplates;

export const selectSkillAssessmentTemplatesFilters = createSelector(
	selectSkillAssessmentTemplatesSlice,
	(state) => state.filters,
);
