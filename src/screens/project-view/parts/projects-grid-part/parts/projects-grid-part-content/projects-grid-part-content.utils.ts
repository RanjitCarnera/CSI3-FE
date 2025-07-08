export const applyFilter = <T>(value?: T) => {
	if (Array.isArray(value)) {
		return value.length ? value : undefined;
	}
	return value || undefined;
};
