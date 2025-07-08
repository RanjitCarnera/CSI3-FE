import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsFilters } from "@components/settings-filters";
import { clearRegionFilters, selectRegionFilters, setRegionFilters } from "@redux/RegionSlice";

export const RegionFiltersComponent = () => {
	const filters = useSelector(selectRegionFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setRegionFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearRegionFilters());
	};
	return (
		<DefaultSettingsFilters
			onChange={handleOnChange}
			onReset={handleOnReset}
			value={filters.filterByName}
		/>
	);
};
