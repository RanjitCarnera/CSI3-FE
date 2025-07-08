import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsFilters } from "@components/settings-filters";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import {
	clearMilestoneTemplateFilters,
	selectMilestoneTemplateFilters,
	setMilestoneTemplateFilters,
} from "@redux/milestone-template.slice";

export const MilestoneTemplateTableFilters = () => {
	const filters = useSelector(selectMilestoneTemplateFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(setMilestoneTemplateFilters({ ...filters, name: e ?? "" }));
	};
	const handleOnReset = () => {
		dispatch(clearMilestoneTemplateFilters());
	};
	return (
		<WithFeatureToggle featureId={"CUC"}>
			<DefaultSettingsFilters
				onChange={handleOnChange}
				onReset={handleOnReset}
				value={filters.name}
			/>
		</WithFeatureToggle>
	);
};
