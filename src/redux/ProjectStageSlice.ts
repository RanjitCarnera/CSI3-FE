import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReduxState} from "../Store";

export interface ProjectStageFilters {
    filterByName?: string;
}

export interface PeopleState {
    filters: ProjectStageFilters
}

const INITIAL_STATE: PeopleState = {
    filters: {},
}

const regionSlice = createSlice({
    name: 'regions',
    initialState: INITIAL_STATE,
    reducers: {
        setProjectStageFilters: (state, action: PayloadAction<ProjectStageFilters>) => {
            state.filters = action.payload
        },
        clearProjectStageFilters: (state) => {
            state.filters = {}
        }
    },
})

export const {setProjectStageFilters, clearProjectStageFilters} = regionSlice.actions
export const ProjectStageSliceReducer = regionSlice.reducer

const selectProjectStageSlice = (state: ReduxState) => state.projectStage

export const selectProjectStageFilters = createSelector(selectProjectStageSlice, state => state.filters)
