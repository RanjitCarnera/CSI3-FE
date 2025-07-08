export interface EditAssignmentRoleFormState {
	name?: string;

	sortOrder: number;
	maxNumberOfProjects?: number;

	utilizationProjectionCapInMonths?: number;
	countAsFullyAllocatedAtPercentage?: number;
	countAsOverallocatedAtPercentage?: number;
	useEndDateOfLastAssignmentOverProjectionCap?: boolean;

	cucTemplate?: string;
}
