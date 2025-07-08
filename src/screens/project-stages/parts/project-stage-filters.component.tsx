import { useDispatch, useSelector } from "react-redux";
import {
	clearProjectStageFilters,
	selectProjectStageFilters,
	setProjectStageFilters,
} from "@redux/ProjectStageSlice";
import { DefaultSettingsFilters } from "@components/settings-filters";

export const ProjectStageFilters = () => {
	const filters = useSelector(selectProjectStageFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setProjectStageFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearProjectStageFilters());
	};
	return (
		<DefaultSettingsFilters
			onChange={handleOnChange}
			onReset={handleOnReset}
			value={filters.filterByName}
		/>
	);
};
