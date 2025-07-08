import {
	clearDivisionFilters,
	selectDivisionFilters,
	setDivisionFilters,
} from "@redux/DivisionSlice";
import { useDispatch, useSelector } from "react-redux";

import { DefaultSettingsFilters } from "@components/settings-filters";

export const DivisionFilters = () => {
	const filters = useSelector(selectDivisionFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setDivisionFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearDivisionFilters());
	};
	return (
		<DefaultSettingsFilters
			onChange={handleOnChange}
			onReset={handleOnReset}
			value={filters.filterByName}
		/>
	);
};
