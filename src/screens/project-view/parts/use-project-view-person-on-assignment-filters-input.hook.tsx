import { useSelector } from "react-redux";
import { selectScenarioProjectFilters } from "@redux/ProjectViewSlice";
import { type PersonOnAssignmentFiltersInput } from "@relay/staffViewPart_Query.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const useProjectViewPersonOnAssignmentFiltersInput = (): PersonOnAssignmentFiltersInput => {
	const filters = useSelector(selectScenarioProjectFilters);
	return {
		currentlyAssignedAssignmentRoles: applyFilter(filters.filterByAssignmentRoles),
		executives: applyFilter(filters.filterByExecutives),
		ids: applyFilter(filters.filterByStaff),
		skillFilters: applyFilter(filters.filterBySkills),
		assignmentStatus: applyFilter(filters.filterByAssignmentStatus),
		assignmentTags: applyFilter(filters.filterByAssignmentTags),
		utilizationStatuses: applyFilter(filters.peopleFilterUtilizationStatus),
		filterExpirationDate: applyFilter(filters.filterBySkillExpirationDate),
	};
};
