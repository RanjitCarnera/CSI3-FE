import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RegionsSelect } from "@components/relay/RegionsSelect";
import { FilterTag } from "@components/ui/filter-tag";
import { selectStaffViewFilters, setStaffViewFilters } from "@redux/StaffViewSlice";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const PeopleFilterRegionsSelect = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	return (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"people-filter-region"}>Region</label>
			<br />
			<RegionsSelect
				fieldValue={filters.peopleFilterRegion}
				placeholder={"Filter by region"}
				updateField={(e) => {
					dispatch(
						setStaffViewFilters({
							...filters,
							peopleFilterRegion: applyFilter(e),
						}),
					);
				}}
			/>
		</div>
	);
};

export const PeopleFilterRegionReset = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	if (!filters.peopleFilterRegion) return <Fragment />;
	return (
		<FilterTag
			icon={"pi pi-times"}
			tooltip={"People filter"}
			header={"Regions"}
			value={filters.peopleFilterRegion?.length + " selected"}
			onClick={() => {
				dispatch(
					setStaffViewFilters({
						...filters,
						peopleFilterRegion: undefined,
					}),
				);
			}}
		/>
	);
};
