import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReduxState} from "../Store";

export interface DivisionFilters {
    filterByName?: string;
}

export interface DivisionState {
    filters: DivisionFilters
}

const INITIAL_STATE: DivisionState = {
    filters: {},
}

const regionSlice = createSlice({
    name: 'divisions',
    initialState: INITIAL_STATE,
    reducers: {
        setDivisionFilters: (state, action: PayloadAction<DivisionFilters>) => {
            state.filters = action.payload
        },
        clearDivisionFilters: (state) => {
            state.filters = {}
        }
    },
})

export const {setDivisionFilters, clearDivisionFilters} = regionSlice.actions
export const DivisionSliceReducer = regionSlice.reducer

const selectDivisionSlice = (state: ReduxState) => state.division

export const selectDivisionFilters = createSelector(selectDivisionSlice, state => state.filters)
