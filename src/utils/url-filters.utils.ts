import { type ProjectViewState } from "@redux/ProjectViewSlice";
import { type StaffViewFilters, type StaffViewState } from "@redux/StaffViewSlice";

export type TypeGuardFn<T> = (obj: any) => obj is T;

/**
 * Get the type-safe filters from the URL param 'filters'.
 * @param url - url
 * @param isFiltersType - type guard function for the filters type see `TypeGuardFn`
 * @returns possible filters
 */
export function getTypedFiltersFromUrl<Filters>(
	url: string,
	isFiltersType: TypeGuardFn<Filters>,
): Filters | undefined {
	const URI = new URL(url);
	const urlParams = new URLSearchParams(URI.search);
	const filtersParam = urlParams.get("filters");

	if (!filtersParam) return;

	try {
		const decodedString = atob(filtersParam);

		const parsedFilters = JSON.parse(decodedString);

		if (isFiltersType(parsedFilters)) {
			console.log("parsed", parsedFilters);
			return parsedFilters;
		} else {
			console.warn("Filters parameter is not of given type.");
			return undefined;
		}
	} catch (error) {
		console.error("Invalid filters parameter");
		return undefined;
	}
}

enum Types {
	array = "object",
	string = "string",
	undefined = "undefined",
	boolean = "boolean",
	number = "number",
	object = "object",
}
const isOptionalStringArray = (key: unknown) =>
	[Types.array, Types.undefined].includes(typeof key as Types);
const isOptionalString = (key: unknown) =>
	[Types.string, Types.undefined].includes(typeof key as Types);
const isString = (key: unknown) => Types.string === (typeof key as Types);
const isOptionalNumber = (key: unknown) =>
	[Types.number, Types.undefined].includes(typeof key as Types);
const isOptionalBoolean = (key: unknown) =>
	[Types.boolean, Types.undefined].includes(typeof key as Types);
const isBoolean = (key: unknown) => Types.boolean === (typeof key as Types);
const isObject = (key: unknown) => Types.object === (typeof key as Types);

export function isStaffViewFiltersType(obj: any): obj is StaffViewFilters {
	const checks = [
		typeof obj === "object",
		obj !== null,
		isOptionalString(obj.filterByAllocatedDateMaximum),
		isOptionalString(obj.filterByAllocatedDateMinimum),
		isOptionalString(obj.filterByAssignmentDateMaximum),
		isOptionalString(obj.filterByAssignmentDateMinimum),
		isOptionalStringArray(obj.filterByAssignmentRoles),
		isOptionalStringArray(obj.filterByCurrentlyAssignedAssignmentRoles),
		isOptionalStringArray(obj.filterByDivisions),
		isOptionalStringArray(obj.filterByRegions),
		isOptionalStringArray(obj.filterByStages),
		isOptionalNumber(obj.filterBySalaryMaximum),
		isOptionalNumber(obj.filterBySalaryMinimum),
		isOptionalNumber(obj.filterByGapDaysMinimum),
		isOptionalNumber(obj.filterByGapDaysMaximum),
		isOptionalString(obj.filterByPersonName),
		isOptionalString(obj.endDate),
		isOptionalString(obj.startDate),
		isOptionalStringArray(obj.filterByExecutives),
		isOptionalStringArray(obj.filterByStaff),
		isOptionalBoolean(obj.showPast),
		isString(obj.intervalType),
	];
	return checks.every((check) => check);
}

export function isStaffViewStateType(obj: any): obj is StaffViewState {
	const checks = [
		isBoolean(obj.isStaffViewFiltersVisible),
		isStaffViewFiltersType(obj.filters),
		isOptionalBoolean(obj.isInitialLoad),
	];

	return checks.every((check) => check);
}

export function isProjectViewState(obj: any): obj is ProjectViewState {
	const checks = [isObject(obj.peopleFilters), isObject(obj.projectFilters)];
	return checks.every((check) => check);
}
