import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsFilters } from "@components/settings-filters";
import {
	clearAssignmentRolesFilters,
	selectAssignmentRolesFilters,
	setAssignmentRolesFilters,
} from "@redux/AssignmentRoleSlice";

export const AssignmentRolesFiltersComponent = () => {
	const filters = useSelector(selectAssignmentRolesFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setAssignmentRolesFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearAssignmentRolesFilters());
	};
	return (
		<DefaultSettingsFilters
			onChange={handleOnChange}
			onReset={handleOnReset}
			value={filters.filterByName}
		/>
	);
};
