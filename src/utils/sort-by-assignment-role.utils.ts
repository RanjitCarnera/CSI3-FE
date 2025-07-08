/**
 * Used for sorting by assignment role's sortorder.
 * @param x assignment roles
 * @param y assignment roles
 * @returns list of assignments sorted by sort order from highest to lowest
 */
export const sortByAssignmentRole = (
	x: ReadonlyArray<{ sortOrder: number }>,
	y: ReadonlyArray<{ sortOrder: number }>,
) => {
	const minAssignmentX = x.map((r) => r.sortOrder).min();
	const minAssignmentY = y.map((r) => r.sortOrder).min();

	if (minAssignmentY && minAssignmentX) {
		return minAssignmentX > minAssignmentY ? 1 : -1;
	}
	return minAssignmentX ? 1 : -1;
};
