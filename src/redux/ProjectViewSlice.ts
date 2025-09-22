import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type PreferredViewType } from "@relay/preferredViewTypeForm_CurrentUser.graphql";
import { type SkillFilter } from "@relay/RosterList_StaffRefetch.graphql";
import { type ViewType } from "@relay/ScenarioProjectViewScreen_Query.graphql";
import {
	type AssignmentStatus,
	type LocalDateRangeFilterInput,
	type UtilizationStatus,
} from "@relay/staffViewPart_Query.graphql";
import { deepCompare } from "@utils/deep-compare";
import { initializeFromUrl, updateUrl } from "@utils/url-utils";
import { type ReduxState } from "../Store";

interface ViewOption {
	id: string;
	isDefault: boolean;
	name: string;
	url: string;
	viewType: ViewType;
}

export interface ScenarioPeopleFilters {
	filterByName?: string;
	filterByAssignmentRoles?: string[];
	filterByUtilizationStatus?: UtilizationStatus[];
	filterByFreeDateMinimum?: string;
	filterByFreeDateMaximum?: string;
	filterByAllocatedDateMinimum?: string;
	filterByAllocatedDateMaximum?: string;
	filterBySalaryMinimum?: number;
	filterBySalaryMaximum?: number;
	filterByGapDaysMinimum?: number;
	filterByGapDaysMaximum?: number;
	filterByDistanceMinimum?: number;
	filterByDistanceMaximum?: number;
	filterBySkillCategoryRef?: string;
	filterByStaff?: string[];
	filterBySkills?: SkillFilter[];
	filterByRegions?: string[];
	filterByDivisions?: string[];
	startDate?: string;
	endDate?: string;
	filterBySkillExpirationDate?: LocalDateRangeFilterInput;
}

export type Staffing = "Fully staffed" | "Not Fully Staffed";

export type Sorting =
	| "ByNameAsc"
	| "ByNameDesc"
	| "ByStartDateAsc"
	| "ByStartDateDesc"
	| "ByEndDateAsc"
	| "ByEndDateDesc";

export const sortingOptions = [
	{ label: "By name - ascending", value: "ByNameAsc" },
	{ label: "By name - descending", value: "ByNameDesc" },
	{ label: "By start date - ascending", value: "ByStartDateAsc" },
	{
		label: "By start date - descending",
		value: "ByStartDateDesc",
	},
	{ label: "By end date - ascending", value: "ByEndDateAsc" },
	{ label: "By end date - descending", value: "ByEndDateDesc" },
] as Array<{ label: string; value: Sorting | null }>;

export interface ScenarioProjectFilters {
	filterByName?: string;
	filterByDivisions?: string[];
	filterByRegions?: string[];
	filterByStaffing?: Staffing;
	filterByDateFrom?: string;
	filterByDateTo?: string;
	filterByStage?: string[];
	filterByExecutives?: string[];
	filterByAssignmentRoles?: string[];
	filterByStaff?: string[];
	filterBySkills?: SkillFilter[];
	filterBySkillExpirationDate?: LocalDateRangeFilterInput;
	filterBySkillCategoryRef?: string;
	filterByAssignmentStatus?: AssignmentStatus;
	filterByAssignmentTags?: string[];
	peopleFilterUtilizationStatus?: UtilizationStatus[];
	sorting: Sorting;
}

export interface ProjectViewState {
	peopleFilters: ScenarioPeopleFilters;
	projectFilters: ScenarioProjectFilters;
	isPeopleFiltersVisible: boolean;
	isProjectsExpanded: boolean;
	isProjectsGroupedByTags: boolean;
	areGroupsExpanded: boolean | undefined;
	isProjectFiltersVisible: boolean;
	selectedProjectId?: string;
	page: number;
	showPast: boolean;
	driveTimeCalculations: DriveTimeCalculation[];
	driveTimeErrors: DriveTimeError[];
	isInitialLoad?: boolean;
	fetchKey: number;
}

export interface DriveTimeCalculation {
	driveTime: string;
	projectId: string;
	personId: string;
}

export interface DriveTimeError {
	error: string;
	projectId: string;
	personId: string;
}

const BASE_STATE: ProjectViewState = {
	peopleFilters: {},
	projectFilters: {
		sorting: "ByNameAsc",
	},
	isPeopleFiltersVisible: false,
	isProjectsExpanded: false,
	isProjectsGroupedByTags: false,
	isProjectFiltersVisible: true,
	page: 0,
	showPast: false,
	driveTimeCalculations: [],
	driveTimeErrors: [],
	areGroupsExpanded: undefined,
	fetchKey: 0,
};

const URL_SEARCH_PARAM = "filters";

const INITIAL_STATE: ProjectViewState = initializeFromUrl<ProjectViewState>(
	URL_SEARCH_PARAM,
	BASE_STATE,
);
const initializeViewInitialFilters: Partial<ProjectViewState> = {
	peopleFilters: {},
	projectFilters: {
		sorting: "ByNameAsc",
	},
	isPeopleFiltersVisible: false,
	isProjectsExpanded: false,
	isProjectFiltersVisible: true,
	page: 0,
	showPast: false,
	fetchKey: 0,
};
const projectViewSlice = createSlice({
	name: "project-view",
	initialState: INITIAL_STATE,
	reducers: {
		setProjectViewPeopleFilters: (state, action: PayloadAction<ScenarioPeopleFilters>) => {
			state.peopleFilters = action.payload;
			state.fetchKey += 1;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;

			updateUrl(URL_SEARCH_PARAM, { ...state, peopleFilters: action.payload }, BASE_STATE);
		},
		setProjectViewProjectFilters: (state, action: PayloadAction<ScenarioProjectFilters>) => {
			state.projectFilters = action.payload;
			state.fetchKey += 1;
			state.page = 0;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, projectFilters: action.payload, page: 0 },
				BASE_STATE,
			);
		},
		setProjectViewPeopleFiltersVisible: (state, action: PayloadAction<boolean>) => {
			state.isPeopleFiltersVisible = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, isPeopleFiltersVisible: action.payload },
				BASE_STATE,
			);
		},
		setProjectsExpanded: (state, action: PayloadAction<boolean>) => {
			state.isProjectsExpanded = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, isProjectsExpanded: action.payload },
				BASE_STATE,
			);
		},
		setProjectsIsGroupedByTags: (state, action: PayloadAction<boolean>) => {
			state.isProjectsGroupedByTags = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, isProjectsGroupedByTags: action.payload },
				BASE_STATE,
			);
		},
		setAreGroupsExpanded: (state, action: PayloadAction<boolean | undefined>) => {
			state.areGroupsExpanded = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, areGroupsExpanded: action.payload },
				BASE_STATE,
			);
		},
		setProjectFiltersVisible: (state, action: PayloadAction<boolean>) => {
			state.isProjectFiltersVisible = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, isProjectFiltersVisible: action.payload },
				BASE_STATE,
			);
		},
		setSelectedProjectId: (state, action: PayloadAction<string | undefined>) => {
			state.selectedProjectId = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(
				URL_SEARCH_PARAM,
				{ ...state, selectedProjectId: action.payload },
				BASE_STATE,
			);
		},
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(URL_SEARCH_PARAM, { ...state, page: action.payload }, BASE_STATE);
		},
		setShowPast: (state, action: PayloadAction<boolean>) => {
			state.showPast = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			updateUrl(URL_SEARCH_PARAM, { ...state, showPast: action.payload }, BASE_STATE);
		},
		initializeFromPreferredView: (
			state,
			action: PayloadAction<
				{ preferredViewType: PreferredViewType; scenarioId: string } | undefined
			>,
		) => {
			if (!action.payload) return;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			if (!action.payload.scenarioId) return;
			if (action.payload.preferredViewType === "StaffView") {
				updateUrl(
					URL_SEARCH_PARAM,
					{ ...state },
					BASE_STATE,
					"/scenarios/U2NlbmFyaW86YTU1YzU4N2YtOGQ2Ny00NWIxLWFmZDAtYmFhMGZmZjRjMjhl/staff-view",
				);
			}
		},
		initializeFromDefaultView: (state, action: PayloadAction<ViewOption | undefined>) => {
			if (!action.payload) return;

			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;

			const currentStateEqualsInitialState = deepCompare(initializeViewInitialFilters, state);
			if (currentStateEqualsInitialState) {
				return;
			}

			const url = new URL(decodeURIComponent(action.payload.url));
			const params = new URLSearchParams(url.search);
			const filtersString = params.get("filters") ?? "e30=";
			const defaultViewFilters = JSON.parse(atob(filtersString)) as ProjectViewState;

			state.projectFilters = defaultViewFilters.projectFilters;
			state.peopleFilters = defaultViewFilters.peopleFilters;
			state.isPeopleFiltersVisible = defaultViewFilters.isPeopleFiltersVisible;
			state.isProjectFiltersVisible = defaultViewFilters.isProjectFiltersVisible;
			state.page = defaultViewFilters.page;
			state.isProjectsExpanded = defaultViewFilters.isProjectsExpanded;
			state.selectedProjectId = defaultViewFilters.selectedProjectId;
			state.showPast = defaultViewFilters.showPast;

			updateUrl(URL_SEARCH_PARAM, { ...state }, BASE_STATE);
		},
		addDriveTimeCalculations: (
			state,
			action: PayloadAction<{
				driveTimes: DriveTimeCalculation[];
				errors: DriveTimeError[];
			}>,
		) => {
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;

			state.driveTimeCalculations.push(...action.payload.driveTimes);
			state.driveTimeErrors.push(...action.payload.errors);
		},
		setProjectViewInitialLoad: (state) => {
			state.isInitialLoad = true;
		},
	},
});

export const {
	setProjectViewPeopleFilters,
	setProjectViewProjectFilters,
	setProjectsExpanded,
	setProjectFiltersVisible,
	setProjectsIsGroupedByTags,
	setAreGroupsExpanded,
	setSelectedProjectId,
	setPage,
	setShowPast,
	initializeFromDefaultView,
	addDriveTimeCalculations,
	initializeFromPreferredView,
} = projectViewSlice.actions;
export const ProjectViewSliceReducer = projectViewSlice.reducer;

export const selectProjectViewSlice = (state: ReduxState) => state.scenario;

export const selectScenarioPeopleFilters = createSelector(
	selectProjectViewSlice,
	(state) => state.peopleFilters || {},
);
export const selectScenarioProjectFilters = createSelector(
	selectProjectViewSlice,
	(state) => state.projectFilters || {},
);
export const selectIsPeopleFilterVisible = createSelector(
	selectProjectViewSlice,
	(state) => state.isPeopleFiltersVisible,
);
export const selectIsProjectsExpanded = createSelector(
	selectProjectViewSlice,
	(state) => state.isProjectsExpanded,
);
export const selectIsProjectsGroupedByTags = createSelector(
	selectProjectViewSlice,
	(state) => state.isProjectsGroupedByTags,
);
export const selectAreGroupsExpanded = createSelector(
	selectProjectViewSlice,
	(state) => state.areGroupsExpanded,
);
export const selectIsProjectFiltersVisible = createSelector(
	selectProjectViewSlice,
	(state) => state.isProjectFiltersVisible,
);
export const selectSelectedProjectId = createSelector(
	selectProjectViewSlice,
	(state) => state.selectedProjectId,
);
export const selectPage = createSelector(selectProjectViewSlice, (state) => state.page);
export const selectShowPast = createSelector(selectProjectViewSlice, (state) => state.showPast);
export const selectDriveTimeCalculations = createSelector(
	selectProjectViewSlice,
	(state) => state.driveTimeCalculations,
);
export const selectDriveTimeErrors = createSelector(
	selectProjectViewSlice,
	(state) => state.driveTimeErrors,
);
export const selectProjectViewFetchKey = createSelector(
	selectProjectViewSlice,
	(state) => state.fetchKey,
);
