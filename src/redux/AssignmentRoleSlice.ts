import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ReduxState} from "../Store";

export interface AssignmentRolesFilters {
    filterByName?: string;
}

export interface AssignmentRolesState {
    filters: AssignmentRolesFilters
}

const INITIAL_STATE: AssignmentRolesState = {
    filters: {},
}

const assignmentRoleSlice = createSlice({
    name: 'assignment-roles',
    initialState: INITIAL_STATE,
    reducers: {
        setAssignmentRolesFilters: (state, action: PayloadAction<AssignmentRolesFilters>) => {
            state.filters = action.payload
        },
        clearAssignmentRolesFilters: (state) => {
            state.filters = {}
        }
    },
})

export const {setAssignmentRolesFilters, clearAssignmentRolesFilters} = assignmentRoleSlice.actions
export const AssignmentRoleSliceReducer = assignmentRoleSlice.reducer

const selectAssignmentRolesSlice = (state: ReduxState) => state.assignmentRoles

export const selectAssignmentRolesFilters = createSelector(selectAssignmentRolesSlice, state => state.filters)
