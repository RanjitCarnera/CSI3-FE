import { useSelector } from "react-redux";
import { selectStaffViewFilters } from "@redux/StaffViewSlice";

export const useStaffViewProjectWithAssignmentsFiltersInput = () => {
	const filters = useSelector(selectStaffViewFilters);
	return {
		ids: filters.filterByProjects?.length ? filters.filterByProjects : undefined,
		divisions: filters.filterByDivisions,
		stages: filters.filterByStages,
		regions: filters.filterByRegions,
		executives: filters.filterByExecutives?.length ? filters.filterByExecutives : undefined,
	};
};
