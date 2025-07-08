export type TagsTableColumnsField = "data.name" | "data.sortOrder" | "data.color" | "actions";
export const tagsTableColumns: Array<{ field: TagsTableColumnsField; header: string }> = [
	{
		field: "data.name",
		header: "Name",
	},
	{
		field: "data.sortOrder",
		header: "Sorting",
	},
	{
		field: "data.color",
		header: "Color",
	},
	{
		field: "actions",
		header: "Actions",
	},
];
