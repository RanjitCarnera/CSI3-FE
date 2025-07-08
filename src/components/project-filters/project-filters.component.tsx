import { Form } from "@thekeytechnology/framework-react-components";
import { useDispatch, useSelector } from "react-redux";
import { DivisionsSelect } from "@components/relay/DivisionsSelect";
import { ProjectStagesSelect } from "@components/relay/ProjectStagesSelect";
import { RegionsSelect } from "@components/relay/RegionsSelect";
import { DefaultSettingsFilters } from "@components/settings-filters";
import { Wrapper } from "./project-filters.styles";
import {
	clearProjectFilters,
	selectProjectFilters,
	setProjectFilters,
} from "../../redux/ProjectSlice";

export const ProjectFiltersComponent = () => {
	const filters = useSelector(selectProjectFilters);
	const dispatch = useDispatch();

	const handleOnChange = (e?: string) => {
		dispatch(
			setProjectFilters({
				...filters,
				filterByName: e,
			}),
		);
	};
	const handleOnReset = () => {
		dispatch(clearProjectFilters());
	};

	const handleRegionsOnUpdate = (e?: string[]) => {
		dispatch(setProjectFilters({ ...filters, filterByRegions: e?.length ? e : undefined }));
	};
	const handleDivisionsOnUpdate = (e?: string[]) => {
		dispatch(setProjectFilters({ ...filters, filterByDivisions: e?.length ? e : undefined }));
	};
	const handleStagesOnUpdate = (e?: string[]) => {
		dispatch(setProjectFilters({ ...filters, filterByStages: e?.length ? e : undefined }));
	};
	return (
		<Wrapper>
			<DefaultSettingsFilters
				value={filters.filterByName}
				onChange={handleOnChange}
				onReset={handleOnReset}
			>
				<Form style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
					<RegionsSelect
						fieldValue={filters.filterByRegions}
						placeholder={"Filter by regions..."}
						updateField={handleRegionsOnUpdate}
					/>
					<DivisionsSelect
						fieldValue={filters.filterByDivisions}
						placeholder={"Filter by divisions..."}
						updateField={handleDivisionsOnUpdate}
					/>
					<ProjectStagesSelect
						fieldValue={filters.filterByStages}
						placeholder={"Filter by stages..."}
						updateField={handleStagesOnUpdate}
					/>
				</Form>
			</DefaultSettingsFilters>
		</Wrapper>
	);
};
