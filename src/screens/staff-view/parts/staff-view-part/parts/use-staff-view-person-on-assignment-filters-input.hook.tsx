import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectStaffViewFilters } from "@redux/StaffViewSlice";
import { type PersonOnAssignmentFiltersInput } from "@relay/staffViewPart_Query.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";
import { useStaffViewUtilizationWindow } from "@utils/use-utilization-window.hook";

export const useStaffViewPersonOnAssignmentFiltersInput =
	(): PersonOnAssignmentFiltersInput | null => {
		const filters = useSelector(selectStaffViewFilters);
		const utilizationWindow = useStaffViewUtilizationWindow();
		return useMemo(() => {
			return {
				executives: filters.filterByExecutives?.length
					? filters.filterByExecutives
					: undefined,
				gapDays: {
					from: filters.filterByGapDaysMinimum,
					to: filters.filterByGapDaysMaximum,
				},
				salary: { from: filters.filterBySalaryMinimum, to: filters.filterBySalaryMaximum },
				assignmentInDateRange: {
					from:
						filters.filterByAssignmentDateMinimum ??
						filters.filterByAllocatedDateMinimum,
					to:
						filters.filterByAssignmentDateMaximum ??
						filters.filterByAllocatedDateMaximum,
				},
				ids: filters.filterByStaff,
				name: applyFilter(filters.filterByPersonName),
				currentlyAssignedAssignmentRoles: filters.filterByCurrentlyAssignedAssignmentRoles,
				jobTitles: filters.filterByAssignmentRoles,
				utilizationStatuses: filters.filterByUtilizationStatus,
				utilizationWindow,
				assignmentTags: applyFilter(filters.filterByAssignmentTags),
				regions: applyFilter(filters.peopleFilterRegion),
				divisions: applyFilter(filters.peopleFilterDivision),
				skillFilters: applyFilter(filters.peopleFilterSkills),
				assignmentStatus: applyFilter(filters.filterByAssignmentStatus),
				filterExpirationDate: applyFilter(filters.filterBySkillExpirationDate),
			};
		}, [filters, utilizationWindow]);
	};
