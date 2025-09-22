import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment.graphql";
import type {
	AvailabilityForecastKindEnum,
	GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$data,
} from "@relay/GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment.graphql";
import type { GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment.graphql";
import type { GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment.graphql";
import { type ReduxState } from "../Store";
import { initializeFromUrl, updateUrl } from "../utils/url-utils";

export interface ForecastColumn {
	yearMonth: string;
	needed: number;
	available: number;
	availablePeople: Array<{
		id: string;
		name: string;
	}>;
	difference: number;
	projects: number;
}

export interface ForecastRow {
	roles: Array<{ name: string }>;
	columns: ForecastColumn[];
}

export type AvailabilityForecast =
	| GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$data
	| GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$data
	| GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$data
	| GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$data;

export interface ForecastRowParameter {
	rolesRef: string[];
}

export interface AvailabilityForecastParameters {
	fromOpt?: string;
	toOpt?: string;
	filterByDivisionsOpt?: string[];
	filterByRegionsOpt?: string[];
	filterByStagesOpt?: string[];
	filterByProjectsOpt?: string[];
	countPossibleUtilizationNotPeople?: boolean;
	showProjects?: boolean;
	rows?: ForecastRowParameter[];
	kind: AvailabilityForecastKindEnum;
}

export interface AvailabilityForecastState {
	parameters?: AvailabilityForecastParameters;
	forecast?: AvailabilityForecast;
}

const BASE_STATE: AvailabilityForecastState = {};

const URL_SEARCH_PARAM = "parameters";

const INITIAL_STATE: AvailabilityForecastState = initializeFromUrl<AvailabilityForecastState>(
	URL_SEARCH_PARAM,
	BASE_STATE,
);

const regionSlice = createSlice({
	name: "staff-view",
	initialState: INITIAL_STATE,
	reducers: {
		setAvailabilityForecastParameters: (
			state,
			action: PayloadAction<AvailabilityForecastParameters>,
		) => {
			state.parameters = action.payload;
			updateUrl(URL_SEARCH_PARAM, { parameters: action.payload }, BASE_STATE);
		},
		setAvailabilityForecast: (state, action: PayloadAction<AvailabilityForecast>) => {
			state.forecast = action.payload as Writable<AvailabilityForecast>;
		},
	},
});

export const { setAvailabilityForecastParameters, setAvailabilityForecast } = regionSlice.actions;
export const AvailabilityForecastSliceReducer = regionSlice.reducer;

const selectAvailabilityForecastSlice = (state: ReduxState) => state.availabilityForecast;

export const selectAvailabilityForecastParameters = createSelector(
	selectAvailabilityForecastSlice,
	(state) => state.parameters,
);
export const selectAvailabilityForecast = createSelector(
	selectAvailabilityForecastSlice,
	(state) => state.forecast,
);
