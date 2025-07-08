import { useSelector } from "react-redux";
import { match } from "ts-pattern";
import { selectScenarioProjectFilters } from "@redux/ProjectViewSlice";
import type { Staffing } from "@relay/projectsGridPartContent_Refetch.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const useProjectViewFilters = () => {
	const projectFilters = useSelector(selectScenarioProjectFilters);
	return {
		projectFilters: {
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
		},
		personOnAssignmentFilters: {
			currentlyAssignedAssignmentRoles: applyFilter(projectFilters.filterByAssignmentRoles),
			executives: applyFilter(projectFilters.filterByExecutives),
			ids: applyFilter(projectFilters.filterByStaff),
			skillFilters: applyFilter(projectFilters.filterBySkills),
			assignmentStatus: applyFilter(projectFilters.filterByAssignmentStatus),
			assignmentTags: applyFilter(projectFilters.filterByAssignmentTags),
			utilizationStatuses: applyFilter(projectFilters.peopleFilterUtilizationStatus),
		},
	};
};
