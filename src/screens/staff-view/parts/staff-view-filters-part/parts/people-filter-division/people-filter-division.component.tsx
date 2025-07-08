import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DivisionsSelect } from "@components/relay/DivisionsSelect";
import { FilterTag } from "@components/ui/filter-tag";
import { selectStaffViewFilters, setStaffViewFilters } from "@redux/StaffViewSlice";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const PeopleFilterDivisionsSelect = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	return (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"people-filter-division"}>Division</label>
			<br />
			<DivisionsSelect
				fieldValue={filters.peopleFilterDivision}
				placeholder={"Filter by division"}
				updateField={(e) => {
					dispatch(
						setStaffViewFilters({
							...filters,
							peopleFilterDivision: applyFilter(e),
						}),
					);
				}}
			/>
		</div>
	);
};

export const PeopleFilterDivisionsReset = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	if (!filters.peopleFilterDivision) return <Fragment />;
	return (
		<FilterTag
			icon={"pi pi-times"}
			tooltip={"People filter"}
			header={"Divisions"}
			value={filters.peopleFilterDivision?.length + " selected"}
			onClick={() => {
				dispatch(
					setStaffViewFilters({
						...filters,
						peopleFilterDivision: undefined,
					}),
				);
			}}
		/>
	);
};
