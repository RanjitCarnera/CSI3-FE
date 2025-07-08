import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsFilters } from "@components/settings-filters";
import {
	clearScenarioFilters,
	selectScenarioFilters,
	setScenarioFilters,
} from "@redux/ScenarioSlice";

export const ScenarioFilters = () => {
	const filters = useSelector(selectScenarioFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setScenarioFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearScenarioFilters());
	};
	return (
		<DefaultSettingsFilters
			onChange={handleOnChange}
			onReset={handleOnReset}
			value={filters.filterByName}
		/>
	);
};
