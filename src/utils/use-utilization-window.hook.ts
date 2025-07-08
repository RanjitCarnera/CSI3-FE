import moment, { type Moment } from "moment-timezone";
import { useSelector } from "react-redux";
import { match } from "ts-pattern";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import { selectScenarioPeopleFilters } from "@redux/ProjectViewSlice";
import { selectStaffViewFilters } from "@redux/StaffViewSlice";
import { type UtilizationWindowInput } from "@relay/ScenarioProjectViewScreen_Query.graphql";

/**
 * When userExtension.utilizationDisplay is set to "UtilizationToday",
 * only use the current day as the utilization window when no actual utilzation window was set
 * @param utilizationWindowOptIn - the utilization window that was passed in from the respective redux slice
 */
const useUtilizationWindow = (utilizationWindowOptIn?: UtilizationWindowInput | null) => {
	const format = (date: Moment) => date.format("YYYY-MM-DD");
	const cu = useSelector(selectCurrentUser);
	const utilizationWindowOptOut: UtilizationWindowInput | null = match(
		cu?.user.extension.utilizationDisplay ?? null,
	)
		.returnType<UtilizationWindowInput | null>()
		.with("UtilizationForecast", () => utilizationWindowOptIn ?? null)
		.with("UtilizationToday", () => {
			if (utilizationWindowOptIn?.utilizationStart || utilizationWindowOptIn?.utilizationEnd)
				return utilizationWindowOptIn;
			return {
				utilizationStart: format(moment()),
				utilizationEnd: format(moment()),
			};
		})
		.with(null, () => null)
		.exhaustive();
	return utilizationWindowOptOut;
};

/**
 * <code>useUtilizationWindow</code> decorated with the filters for project view. Used in roster / project grid.
 * @returns the utilization window for project view
 */
export const useProjectViewUtilizationWindow = () => {
	const filters = useSelector(selectScenarioPeopleFilters);
	return useUtilizationWindow(
		filters.startDate && filters.endDate
			? {
					utilizationStart: filters.startDate,
					utilizationEnd: filters.endDate,
			  }
			: undefined,
	);
};

/**
 * <code>useUtilizationWindow</code> decorated with the filters for staff view. Used in staff view part.
 * @returns the utilization window for staff view
 */
export const useStaffViewUtilizationWindow = () => {
	const filters = useSelector(selectStaffViewFilters);
	return useUtilizationWindow(
		filters.startDate && filters.endDate
			? {
					utilizationStart: filters.startDate,
					utilizationEnd: filters.endDate,
			  }
			: undefined,
	);
};
