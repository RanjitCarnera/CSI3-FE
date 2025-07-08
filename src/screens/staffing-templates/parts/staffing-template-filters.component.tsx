import { useDispatch, useSelector } from "react-redux";
import {
	clearStaffingTemplateFilters,
	selectStaffingTemplateFilters,
	setStaffingTemplateFilters,
} from "../../../redux/StaffingTemplatesSlice";
import { DefaultSettingsFilters } from "@components/settings-filters";

export const StaffingTemplateFilters = () => {
	const filters = useSelector(selectStaffingTemplateFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setStaffingTemplateFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearStaffingTemplateFilters());
	};
	return (
		<DefaultSettingsFilters
			onChange={handleOnChange}
			onReset={handleOnReset}
			value={filters.filterByName}
		/>
	);
};
