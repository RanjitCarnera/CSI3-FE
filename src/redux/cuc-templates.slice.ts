import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReduxState } from "../Store";
import { CucTemplateFilters } from "@screens/cuc-templates/parts/table/cuc-templates-table.types";

export interface CucTemplateState {
	filters: CucTemplateFilters;
}

const INITIAL_STATE: CucTemplateState = {
	filters: {
		filterByName: "",
	},
};

const slice = createSlice({
	name: "cucTemplates",
	initialState: INITIAL_STATE,
	reducers: {
		setFilters: (state, action: PayloadAction<CucTemplateFilters>) => {
			state.filters = action.payload;
		},
		clearFilters: (state) => {
			state.filters = INITIAL_STATE.filters;
		},
	},
});

export const { setFilters: setCucTemplateFilters, clearFilters: clearCucTemplateFilters } =
	slice.actions;
export const CucTemplateSliceReducer = slice.reducer;

const selectCucTemplateSlice = (state: ReduxState) => state.cucTemplates;

export const selectCucTemplateFilters = createSelector(
	selectCucTemplateSlice,
	(state) => state.filters,
);
