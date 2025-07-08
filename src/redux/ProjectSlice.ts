import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReduxState } from "../Store";

export interface ProjectFilters {
	filterByName?: string;
	filterByDivisions?: string[];
	filterByRegions?: string[];
	filterByStages?: string[];
}

export interface ProjectsState {
	filters: ProjectFilters;
}

const INITIAL_STATE: ProjectsState = {
	filters: {},
};

const projectSlice = createSlice({
	name: "projects",
	initialState: INITIAL_STATE,
	reducers: {
		setProjectFilters: (state, action: PayloadAction<ProjectFilters>) => {
			state.filters = action.payload;
		},
		clearProjectFilters: (state) => {
			state.filters = {};
		},
	},
});

export const { setProjectFilters, clearProjectFilters } = projectSlice.actions;
export const ProjectSliceReducer = projectSlice.reducer;

const selectProjectSlice = (state: ReduxState) => state.projects;

export const selectProjectFilters = createSelector(selectProjectSlice, (state) => state.filters);
