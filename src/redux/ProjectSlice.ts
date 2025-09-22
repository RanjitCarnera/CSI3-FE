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
	activationStatus?: boolean;
	connectionId: string;
	selection: Array<{ id: string }>;
}

const INITIAL_STATE: ProjectsState = {
	filters: {},
	activationStatus: true,
	connectionId: "",
	selection: [],
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
		setActivationStatus: (state, action: PayloadAction<boolean>) => {
			state.activationStatus = action.payload;
		},
		setSelection: (state, action: PayloadAction<Array<{ id: string }>>) => {
			state.selection = action.payload;
		},
		setConnectionId: (state, action: PayloadAction<string>) => {
			state.connectionId = action.payload;
		},
	},
});

export const {
	setProjectFilters,
	clearProjectFilters,
	setActivationStatus,
	setSelection,
	setConnectionId,
} = projectSlice.actions;
export const ProjectSliceReducer = projectSlice.reducer;

const selectProjectSlice = (state: ReduxState) => state.projects;

export const selectProjectFilters = createSelector(selectProjectSlice, (state) => state.filters);
export const selectProjectActivationStatus = createSelector(
	selectProjectSlice,
	(state) => state.activationStatus,
);
export const selectProjectSelection = createSelector(
	selectProjectSlice,
	(state) => state.selection,
);
export const selectProjectConnectionId = createSelector(
	selectProjectSlice,
	(state) => state.connectionId,
);
