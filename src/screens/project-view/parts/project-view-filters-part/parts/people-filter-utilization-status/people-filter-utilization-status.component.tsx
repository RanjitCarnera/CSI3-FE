import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilterTag } from "@components/ui/filter-tag";
import { UtilizationStatusSelect } from "@components/ui/UtilizationStatusSelect";
import {
	selectScenarioProjectFilters,
	setProjectViewProjectFilters,
} from "@redux/ProjectViewSlice";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const ProjectViewUtilizationStatusFilter = () => {
	const projectFilters = useSelector(selectScenarioProjectFilters);
	const dispatch = useDispatch();

	return (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"assignment-status"}>Utilization status</label>
			<br />
			<UtilizationStatusSelect
				placeholder="Filter by utilization status"
				fieldValue={projectFilters.peopleFilterUtilizationStatus}
				updateField={(newValue) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							peopleFilterUtilizationStatus: applyFilter(newValue),
						}),
					);
				}}
			/>
		</div>
	);
};

export const ProjectViewUtilizationStatusReset = () => {
	const dispatch = useDispatch();
	const filters = useSelector(selectScenarioProjectFilters);
	if (!filters.peopleFilterUtilizationStatus) return <Fragment />;

	return (
		<FilterTag
			icon={"pi pi-times"}
			tooltip={"People filter"}
			header={"Utilization status"}
			value={filters.peopleFilterUtilizationStatus.join(", ")}
			onClick={() => {
				dispatch(
					setProjectViewProjectFilters({
						...filters,
						peopleFilterUtilizationStatus: undefined,
					}),
				);
			}}
		/>
	);
};
