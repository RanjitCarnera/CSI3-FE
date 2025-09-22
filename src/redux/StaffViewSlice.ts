import { createSelector, createSlice, type Draft, type PayloadAction } from "@reduxjs/toolkit";
import { type PreferredViewType } from "@relay/preferredViewTypeForm_CurrentUser.graphql";
import { type UtilizationStatus } from "@relay/RosterList_StaffRefetch.graphql";
import { type ViewType } from "@relay/ScenarioProjectViewScreen_Query.graphql";
import {
	type AssignmentStatus,
	type IntervalType,
	type LocalDateRangeFilterInput,
	type SkillFilter,
	type StaffViewSort,
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

export interface StaffViewFilters {
	filterByAllocatedDateMaximum?: string;
	filterByAllocatedDateMinimum?: string;
	filterByAssignmentDateMaximum?: string;
	filterByAssignmentDateMinimum?: string;

	filterByUtilizationStatus?: UtilizationStatus[];
	filterByAssignmentRoles?: string[];
	filterByCurrentlyAssignedAssignmentRoles?: string[];
	filterByDivisions?: string[];
	filterByPersonName?: string;
	filterByRegions?: string[];
	filterByStages?: string[];
	filterBySalaryMaximum?: number;
	filterBySalaryMinimum?: number;
	filterByGapDaysMinimum?: number;
	filterByGapDaysMaximum?: number;
	filterByExecutives?: string[];
	showPast?: boolean;
	intervalType: IntervalType;
	sort?: StaffViewSort;
	endDate?: string;
	startDate?: string;
	filterByStaff?: string[];
	filterByProjects?: string[];
	filterByAssignmentTags?: string[];
	peopleFilterDivision?: string[];
	peopleFilterRegion?: string[];
	peopleFilterSkills?: SkillFilter[];
	peopleFilterSkillCategory?: string;
	filterByAssignmentStatus?: AssignmentStatus;
	filterBySkillExpirationDate?: LocalDateRangeFilterInput;
}

export interface AssignmentWeightForInterval {
	assignmentRef: string;
	intervalIndex: number;
	weight?: number | null;
}

export interface StaffViewState {
	filters: StaffViewFilters;
	isStaffViewFiltersVisible: boolean;
	shouldUseTagColor: boolean;
	showWeights: boolean;
	shouldSeeUseTagColorButton: boolean;
	isInitialLoad?: boolean;
	assignmentWeightsForIntervals: AssignmentWeightForInterval[];
	changedAssignmentWeightsForIntervals: AssignmentWeightForInterval[];
}

const BASE_STATE: StaffViewState = {
	filters: { intervalType: "Weeks", sort: "NameAsc" },
	shouldUseTagColor: false,
	showWeights: false,
	shouldSeeUseTagColorButton: false,
	isStaffViewFiltersVisible: false,
	assignmentWeightsForIntervals: [],
	changedAssignmentWeightsForIntervals: [],
};

const URL_SEARCH_PARAM = "filters";

const INITIAL_STATE: StaffViewState = initializeFromUrl<StaffViewState>(
	URL_SEARCH_PARAM,
	BASE_STATE,
);

const regionSlice = createSlice({
	name: "staff-view",
	initialState: INITIAL_STATE,
	reducers: {
		setStaffViewFilters: (state, action: PayloadAction<Draft<StaffViewFilters>>) => {
			state.filters = action.payload;
			if (state.filters.intervalType !== action.payload.intervalType) {
				state.changedAssignmentWeightsForIntervals = [];
			}
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			safeUpdateUrl(URL_SEARCH_PARAM, { ...state, filters: action.payload }, BASE_STATE);
		},
		setStaffViewAssignmentWeightsForIntervals(
			state,
			action: PayloadAction<AssignmentWeightForInterval[]>,
		) {
			state.assignmentWeightsForIntervals = action.payload;
		},
		clearStaffViewFilters: (state) => {
			state.filters = {
				...(BASE_STATE.filters as Draft<StaffViewFilters>),
				startDate: "",
				endDate: "",
			};
			state.changedAssignmentWeightsForIntervals = [];
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			safeUpdateUrl(URL_SEARCH_PARAM, { ...state, filters: BASE_STATE.filters }, BASE_STATE);
		},
		setStaffViewFiltersVisible: (state, action: PayloadAction<boolean>) => {
			state.isStaffViewFiltersVisible = action.payload;
			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			safeUpdateUrl(
				URL_SEARCH_PARAM,
				{ ...state, isStaffViewFiltersVisible: action.payload },
				BASE_STATE,
			);
		},
		setShouldUseTagColor: (state, action: PayloadAction<boolean>) => {
			state.shouldUseTagColor = action.payload;
		},
		setShouldSeeUseTagColorButton: (state, action: PayloadAction<boolean>) => {
			state.shouldSeeUseTagColorButton = action.payload;
		},
		setShowWeights: (state, action: PayloadAction<boolean>) => {
			state.showWeights = action.payload;
			safeUpdateUrl(URL_SEARCH_PARAM, { ...state }, BASE_STATE);
		},
		setChangedAssignmentWeightsForInterval: (
			state,
			action: PayloadAction<AssignmentWeightForInterval[]>,
		) => {
			state.changedAssignmentWeightsForIntervals = action.payload;
			safeUpdateUrl(URL_SEARCH_PARAM, { ...state }, BASE_STATE);
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

			if (!action.payload) return;

			if (!action.payload.scenarioId) return;
			if (action.payload.preferredViewType === "ProjectView") {
				/* window.history.pushState(
					null,
					"",
					`/scenarios/U2NlbmFyaW86YTU1YzU4N2YtOGQ2Ny00NWIxLWFmZDAtYmFhMGZmZjRjMjhl/project-view`,
				); */
				safeUpdateUrl(
					URL_SEARCH_PARAM,
					{ ...state },
					BASE_STATE,
					"/scenarios/U2NlbmFyaW86YTU1YzU4N2YtOGQ2Ny00NWIxLWFmZDAtYmFhMGZmZjRjMjhl/project-view",
				);
			}
		},
		initializeFromDefaultView: (state, action: PayloadAction<ViewOption | undefined>) => {
			if (!action.payload) return;

			const initialFilters: Partial<StaffViewState> = {
				filters: {
					intervalType: "Weeks",
					sort: "NameAsc",
				},
				isStaffViewFiltersVisible: false,
			};

			if (state.isInitialLoad === undefined) state.isInitialLoad = true;
			else if (state.isInitialLoad) state.isInitialLoad = false;
			const currentStateEqualsInitialState = deepCompare(initialFilters, state);
			if (currentStateEqualsInitialState) {
				return;
			}

			const url = new URL(decodeURIComponent(action.payload.url));
			const params = new URLSearchParams(url.search);
			const filtersString = params.get("filters") ?? "e30=";
			const defaultViewFilters = JSON.parse(atob(filtersString)) as StaffViewState;

			state.isStaffViewFiltersVisible = defaultViewFilters.isStaffViewFiltersVisible;
			state.filters = defaultViewFilters.filters as Draft<StaffViewFilters>;
			safeUpdateUrl(URL_SEARCH_PARAM, { ...state }, BASE_STATE);
		},
	},
});

const safeUpdateUrl = (
	searchParam: string,
	state: StaffViewState,
	baseState: StaffViewState,
	newUrl?: string,
) => {
	updateUrl(
		searchParam,
		{
			...state,
			assignmentWeightsForIntervals: [],
			changedAssignmentWeightsForIntervals: [],
		},
		baseState,
		newUrl,
	);
};

export const {
	setStaffViewFilters,
	clearStaffViewFilters,
	setStaffViewFiltersVisible,
	initializeFromDefaultView,
	initializeFromPreferredView,
	setShouldUseTagColor,
	setShowWeights,
	setChangedAssignmentWeightsForInterval,
	setStaffViewAssignmentWeightsForIntervals,
	setShouldSeeUseTagColorButton,
} = regionSlice.actions;
export const StaffViewSliceReducer = regionSlice.reducer;

const selectStaffViewSlice = (state: ReduxState) => state.staffView;

export const selectStaffViewFilters = createSelector(
	selectStaffViewSlice,
	(state) => state.filters || { intervalType: "Weeks" },
);
export const selectIsStaffViewFiltersVisible = createSelector(
	selectStaffViewSlice,
	(state) => state.isStaffViewFiltersVisible,
);
export const selectShouldUseTagColor = createSelector(
	selectStaffViewSlice,
	(state) => state.shouldUseTagColor,
);

export const selectShouldSeeUseTagColorButton = createSelector(
	selectStaffViewSlice,
	(state) => state.shouldSeeUseTagColorButton,
);

export const selectAssignmentWeightsForIntervals = createSelector(
	selectStaffViewSlice,
	(state) => state.assignmentWeightsForIntervals,
);
export const selectChangedAssignmentWeightsForIntervals = createSelector(
	selectStaffViewSlice,
	(state) => state.changedAssignmentWeightsForIntervals,
);
export const selectShowWeights = createSelector(selectStaffViewSlice, (state) => state.showWeights);
