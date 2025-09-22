import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReduxState } from "../Store";

export interface PeopleFilters {
	filterByName?: string;
}

export interface PeopleState {
	filters: PeopleFilters;
	connectionId: string;
	selection: Array<{ id: string }>;
	activationStatus: boolean;
}

const INITIAL_STATE: PeopleState = {
	filters: {
		filterByName: "",
	},
	connectionId: "",
	selection: [],
	activationStatus: true,
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
		setConnectionId: (state, action: PayloadAction<string>) => {
			state.connectionId = action.payload;
		},
		setSelection: (state, action: PayloadAction<Array<{ id: string }>>) => {
			state.selection = action.payload;
		},
		setActivationStatus: (state, action: PayloadAction<boolean>) => {
			state.activationStatus = action.payload;
		},
	},
});

export const {
	setPeopleFilters,
	clearPeopleFilters,
	setConnectionId: setPeopleConnectionId,
	setActivationStatus: setPeopleActivationStatus,
	setSelection: setPeopleSelection,
} = peopleSlice.actions;
export const PeopleSliceReducer = peopleSlice.reducer;

const selectPeopleSlice = (state: ReduxState) => state.people;

export const selectPeopleFilters = createSelector(selectPeopleSlice, (state) => state.filters);

export const selectPeopleActivationStatus = createSelector(
	selectPeopleSlice,
	(state) => state.activationStatus,
);
export const selectPeopleSelection = createSelector(selectPeopleSlice, (state) => state.selection);
export const selectPeopleConnectionId = createSelector(
	selectPeopleSlice,
	(state) => state.connectionId,
);
