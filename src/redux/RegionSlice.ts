import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReduxState} from "../Store";

export interface RegionFilters {
    filterByName?: string;
}

export interface PeopleState {
    filters: RegionFilters
}

const INITIAL_STATE: PeopleState = {
    filters: {},
}

const regionSlice = createSlice({
    name: 'regions',
    initialState: INITIAL_STATE,
    reducers: {
        setRegionFilters: (state, action: PayloadAction<RegionFilters>) => {
            state.filters = action.payload
        },
        clearRegionFilters: (state) => {
            state.filters = {}
        }
    },
})

export const {setRegionFilters, clearRegionFilters} = regionSlice.actions
export const RegionSliceReducer = regionSlice.reducer

const selectRegionSlice = (state: ReduxState) => state.region

export const selectRegionFilters = createSelector(selectRegionSlice, state => state.filters)
