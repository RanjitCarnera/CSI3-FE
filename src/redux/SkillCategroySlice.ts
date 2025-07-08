import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReduxState} from "../Store";

export interface SkillCategoryFilters {
    filterByName?: string;
}

export interface SkillFilters {
    filterByName?: string;
    filterBySkillCategoryRef?: string;
}

export interface SkillState {
    skillCategoryFilters: SkillCategoryFilters
    skillFilters: SkillFilters
}

const INITIAL_STATE: SkillState = {
    skillCategoryFilters: {},
    skillFilters: {}
}

const skillSlice = createSlice({
    name: 'skills',
    initialState: INITIAL_STATE,
    reducers: {
        setSkillCategoryFilters: (state, action: PayloadAction<SkillCategoryFilters>) => {
            state.skillCategoryFilters = action.payload
        },
        clearSkillCategoryFilters: (state) => {
            state.skillCategoryFilters = {}
        },
        setSkillFilters: (state, action: PayloadAction<SkillFilters>) => {
            state.skillFilters = action.payload
        },
        clearSkillFilters: (state) => {
            state.skillFilters = {}
        },
    },
})

export const {
    setSkillCategoryFilters,
    clearSkillCategoryFilters,
    setSkillFilters,
    clearSkillFilters
} = skillSlice.actions
export const SkillCategorySliceReducer = skillSlice.reducer

const selectSkillCategorySlice = (state: ReduxState) => state.skills

export const selectSkillCategoryFilters = createSelector(selectSkillCategorySlice, state => state.skillCategoryFilters)
export const selectSkillFilters = createSelector(selectSkillCategorySlice, state => state.skillFilters)
