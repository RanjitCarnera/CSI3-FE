import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxState } from "../Store";

export interface Person {
	id: string;
	name: string;
	address: {
		latitude: number;
		longitude: number;
		lineOne: string;
		postalCode: string;
		city: string;
		state: string;
	};
}

export interface MapState {
	fetchedPeople: Person[];
}

const INITIAL_STATE: MapState = {
	fetchedPeople: [],
};

const mapSlice = createSlice({
	name: "divisions",
	initialState: INITIAL_STATE,
	reducers: {
		setFetchedPeople: (state, action: PayloadAction<Person[]>) => {
			state.fetchedPeople = action.payload;
		},
	},
});

export const { setFetchedPeople } = mapSlice.actions;
export const MapReducer = mapSlice.reducer;

const selectMapState = (state: ReduxState) => state.map;

export const selectFetchedPeople = createSelector(selectMapState, (state) => state.fetchedPeople);
