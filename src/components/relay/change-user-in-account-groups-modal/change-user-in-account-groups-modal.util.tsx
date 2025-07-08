export const filterGroups = (groups: ReadonlyArray<{ id: string }>) => {
	return groups.filter((g) => {
		const parsedId = atob(g.id).split(":")[1];
		return parsedId !== "root-account";
	});
};
