import { useSelector } from "react-redux";
import { match } from "ts-pattern";
import { selectScenarioProjectFilters } from "@redux/ProjectViewSlice";
import type { Staffing } from "@relay/staffViewPart_Query.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const useProjectViewProjectWithAssignmentsFiltersInput = () => {
	const projectFilters = useSelector(selectScenarioProjectFilters);
	return {
		divisions: applyFilter(projectFilters.filterByDivisions),
		regions: applyFilter(projectFilters.filterByRegions),
		stages: applyFilter(projectFilters.filterByStage),
		inDateRange:
			projectFilters.filterByDateFrom || projectFilters.filterByDateTo
				? {
						from: projectFilters.filterByDateFrom,
						to: projectFilters.filterByDateTo,
				  }
				: undefined,
		executives: applyFilter(projectFilters.filterByExecutives),
		staffing: match(projectFilters.filterByStaffing)
			.returnType<Staffing | undefined>()
			.with("Fully staffed", () => "FullyStaffed")
			.with("Not Fully Staffed", () => "NotFullyStaffed")
			.otherwise(() => undefined),
		assignmentStatus: applyFilter(projectFilters.filterByAssignmentStatus),
	};
};
