export type ColumnField =
	| "name"
	| "sortOrder"
	| "maxNumberOfProjects"
	| "utilizationProjectionCapInMonths"
	| "countAsFullyAllocatedAtPercentage"
	| "countAsOverallocatedAtPercentage"
	| "actions";
export const columns: Array<{ field: ColumnField; header: string }> = [
	{
		field: "name",
		header: "Name",
	},
	{
		field: "sortOrder",
		header: "Sorting",
	},
	{
		field: "maxNumberOfProjects",
		header: "Max. number of projects",
	},
	{
		field: "utilizationProjectionCapInMonths",
		header: "Utilization Forecast cap",
	},
	{
		field: "countAsFullyAllocatedAtPercentage",
		header: "Fully allocated at utilization",
	},
	{
		field: "countAsOverallocatedAtPercentage",
		header: "Overallocated at utilization",
	},
	{
		field: "actions",
		header: "Actions",
	},
];
