import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsFilters } from "@components/settings-filters";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import {
	clearCucTemplateFilters,
	selectCucTemplateFilters,
	setCucTemplateFilters,
} from "@redux/cuc-templates.slice";

export const CucTemplateTableFilters = () => {
	const filters = useSelector(selectCucTemplateFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(setCucTemplateFilters({ ...filters, filterByName: e ?? "" }));
	};
	const handleOnReset = () => {
		dispatch(clearCucTemplateFilters());
	};
	return (
		<WithFeatureToggle featureId={"CUC"}>
			<DefaultSettingsFilters
				onChange={handleOnChange}
				onReset={handleOnReset}
				value={filters.filterByName}
			/>
		</WithFeatureToggle>
	);
};
