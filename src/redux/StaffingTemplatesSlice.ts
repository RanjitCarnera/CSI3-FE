import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReduxState} from "../Store";

export interface StaffingTemplateFilters {
    filterByName?: string;
}

export interface PeopleState {
    filters: StaffingTemplateFilters
}

const INITIAL_STATE: PeopleState = {
    filters: {},
}

const staffingTemplateSlice = createSlice({
    name: 'staffingTemplates',
    initialState: INITIAL_STATE,
    reducers: {
        setStaffingTemplateFilters: (state, action: PayloadAction<StaffingTemplateFilters>) => {
            state.filters = action.payload
        },
        clearStaffingTemplateFilters: (state) => {
            state.filters = {}
        }
    },
})

export const {setStaffingTemplateFilters, clearStaffingTemplateFilters} = staffingTemplateSlice.actions
export const StaffingTemplateSliceReducer = staffingTemplateSlice.reducer

const selectStaffingTemplateSlice = (state: ReduxState) => state.staffingTemplate

export const selectStaffingTemplateFilters = createSelector(selectStaffingTemplateSlice, state => state.filters)
