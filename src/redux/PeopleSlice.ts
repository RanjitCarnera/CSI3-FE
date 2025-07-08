import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReduxState } from "../Store";

export interface PeopleFilters {
	filterByName?: string;
}

export interface PeopleState {
	filters: PeopleFilters;
}

const INITIAL_STATE: PeopleState = {
	filters: {
		filterByName: "",
	},
};

const peopleSlice = createSlice({
	name: "people",
	initialState: INITIAL_STATE,
	reducers: {
		setPeopleFilters: (state, action: PayloadAction<PeopleFilters>) => {
			state.filters = action.payload;
		},
		clearPeopleFilters: (state) => {
			state.filters = {};
		},
	},
});

export const { setPeopleFilters, clearPeopleFilters } = peopleSlice.actions;
export const PeopleSliceReducer = peopleSlice.reducer;

const selectPeopleSlice = (state: ReduxState) => state.people;

export const selectPeopleFilters = createSelector(selectPeopleSlice, (state) => state.filters);
