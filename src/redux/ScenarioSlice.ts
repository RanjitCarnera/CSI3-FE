import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReduxState} from "../Store";

export interface ScenarioFilters {
    filterByName?: string;
}

export interface ScenariosState {
    filters: ScenarioFilters
}

const INITIAL_STATE: ScenariosState = {
    filters: {},
}

const regionSlice = createSlice({
    name: 'scenarios',
    initialState: INITIAL_STATE,
    reducers: {
        setScenarioFilters: (state, action: PayloadAction<ScenarioFilters>) => {
            state.filters = action.payload
        },
        clearScenarioFilters: (state) => {
            state.filters = {}
        }
    },
})

export const {setScenarioFilters, clearScenarioFilters} = regionSlice.actions
export const ScenarioSliceReducer = regionSlice.reducer

const selectScenarioSlice = (state: ReduxState) => state.scenarios

export const selectScenarioFilters = createSelector(selectScenarioSlice, state => state.filters)
