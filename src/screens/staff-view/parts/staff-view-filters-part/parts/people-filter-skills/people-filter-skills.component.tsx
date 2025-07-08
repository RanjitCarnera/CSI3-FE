import React, { Fragment, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SkillCategorySelect } from "@components/relay/SkillCategorySelect";
import { SkillsSelect } from "@components/relay/SkillsSelect";
import { FilterTag } from "@components/ui/filter-tag";
import { selectStaffViewFilters, setStaffViewFilters } from "@redux/StaffViewSlice";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

export const PeopleFilterSkillsSelect = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	return (
		<>
			<div className="field mr-2" style={{ minWidth: 250 }}>
				<label htmlFor={"people-filter-category-skills"}>Attributes Category</label>
				<br />
				<Suspense>
					<SkillCategorySelect
						fieldValue={filters.peopleFilterSkillCategory}
						placeholder={"Filter attributes by category"}
						updateField={(e) => {
							dispatch(
								setStaffViewFilters({
									...filters,
									peopleFilterSkillCategory: applyFilter(e),
								}),
							);
						}}
					/>
				</Suspense>
			</div>
			<div className="field mr-2" style={{ minWidth: 150 }}>
				<label htmlFor={"people-filter-skills"}>Attributes</label>
				<br />
				<Suspense>
					<SkillsSelect
						fieldValue={filters.peopleFilterSkills}
						placeholder={"Filter by attributes"}
						updateField={(e) => {
							dispatch(
								setStaffViewFilters({
									...filters,
									peopleFilterSkills: applyFilter(e),
								}),
							);
						}}
					/>
				</Suspense>
			</div>
		</>
	);
};

export const PeopleFilterSkillsReset = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	if (!filters.peopleFilterSkills) return <Fragment />;
	return (
		<FilterTag
			icon={"pi pi-times"}
			tooltip={"People filter"}
			header={"Attributes"}
			value={filters.peopleFilterSkills?.length + " selected"}
			onClick={() => {
				dispatch(
					setStaffViewFilters({
						...filters,
						peopleFilterSkills: undefined,
						peopleFilterSkillCategory: undefined,
					}),
				);
			}}
		/>
	);
};

export const PeopleFilterAssignmentStatusReset = () => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	if (!filters.filterByAssignmentStatus) return <Fragment />;
	return (
		<FilterTag
			icon={"pi pi-times"}
			header={"Assignment status"}
			value={filters.filterByAssignmentStatus}
			onClick={() => {
				dispatch(
					setStaffViewFilters({
						...filters,
						filterByAssignmentStatus: undefined,
					}),
				);
			}}
		/>
	);
};
