import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { type rosterListActiveFilters_DivisionRegionFragment$key } from "@relay/rosterListActiveFilters_DivisionRegionFragment.graphql";
import { type rosterListActiveFilters_ScenarioFragment$key } from "@relay/rosterListActiveFilters_ScenarioFragment.graphql";
import {
	QUERY_FRAGMENT,
	SCENARIO_FRAGMENT,
} from "@screens/project-view/parts/roster-part/parts/roster-list-active-filters/roster-list-active-filters.graphql";
import { type RosterListActiveFiltersProps } from "@screens/project-view/parts/roster-part/parts/roster-list-active-filters/roster-list-active-filters.types";
import { RosterListNameFilter } from "@screens/project-view/parts/roster-part/parts/roster-list-name-filter/roster-list-name-filter.component";
import { formatCurrency } from "../../../../../../components/ui/CurrencyDisplay";
import { FilterTag } from "../../../../../../components/ui/filter-tag";
import {
	selectScenarioPeopleFilters,
	setProjectViewPeopleFilters,
} from "../../../../../../redux/ProjectViewSlice";

export const RosterListActiveFilters = ({
	className,
	queryRef,
	scenarioRef,
}: RosterListActiveFiltersProps) => {
	const filters = useSelector(selectScenarioPeopleFilters) || {};
	const scenario = useFragment<rosterListActiveFilters_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioRef,
	);

	const {
		Region: {
			Regions: { edges: regionEdges },
		},
		Division: {
			Divisions: { edges: divisionEdges },
		},
		Assignments: {
			AssignmentRoles: { edges: assignmentRoleEdges },
		},
		Skills: {
			Skills: { edges: skillsEdges },
			SkillCategories: { edges: skillCategoriesEdges },
		},
	} = useFragment<rosterListActiveFilters_DivisionRegionFragment$key>(QUERY_FRAGMENT, queryRef);
	const regions = regionEdges!.map((e) => e!.node);
	const divisions = divisionEdges!.map((e) => e!.node);
	const assignmentRoles = assignmentRoleEdges!.map((e) => e!.node);
	const skills = skillsEdges!.map((e) => e!.node);
	const skillCategories = skillCategoriesEdges!.map((e) => e!.node);
	const utilizations = Array.from(
		new Set(scenario.utilization.personUtilizations.map((e) => e.status)).keys(),
	);
	const divisionNames = divisions
		.filter((d) => filters.filterByDivisions?.includes(d.id))
		.map((d) => d.name)
		.join(", ");
	const regionNames = regions
		.filter((d) => filters.filterByRegions?.includes(d.id))
		.map((d) => d.name)
		.join(", ");
	const jobTitleNames = assignmentRoles
		.filter((d) => filters.filterByAssignmentRoles?.includes(d.id))
		.map((d) => d.name)
		.join(", ");
	const skillsNames = skills
		.filter((d) => filters.filterBySkills?.map((e) => e.skillId)?.includes(d.id))
		.map((d) => d.name)
		.join(", ");
	const utilizationNames = utilizations
		.filter((e) => filters.filterByUtilizationStatus?.includes(e))
		.join(", ");

	const dispatch = useDispatch();

	return (
		<div className={`flex flex-wrap p-1 gap-2 ${className}`}>
			<RosterListNameFilter />
			{filters.startDate && filters.endDate && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Utilization window"}
					value={`${filters.startDate} - ${filters.endDate}`}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								startDate: undefined,
								endDate: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByAssignmentRoles && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Job Title"}
					tooltip={jobTitleNames}
					value={filters.filterByAssignmentRoles?.length + "x selected"}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByAssignmentRoles: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByUtilizationStatus && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Utilization"}
					tooltip={utilizationNames}
					value={filters.filterByUtilizationStatus?.length + "x selected"}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByUtilizationStatus: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByFreeDateMinimum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Free from"}
					value={filters.filterByFreeDateMinimum}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByFreeDateMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByFreeDateMaximum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Free until"}
					value={filters.filterByFreeDateMaximum}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByFreeDateMaximum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterBySalaryMinimum !== undefined && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Salary from"}
					value={formatCurrency(filters.filterBySalaryMinimum)}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterBySalaryMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterBySalaryMaximum !== undefined && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Salary to"}
					value={formatCurrency(filters.filterBySalaryMaximum)}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterBySalaryMaximum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByGapDaysMinimum !== undefined && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Gap days from"}
					value={filters.filterByGapDaysMinimum + ""}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByGapDaysMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByGapDaysMaximum !== undefined && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Gap days to"}
					value={filters.filterByGapDaysMaximum + ""}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByGapDaysMaximum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByDistanceMinimum !== undefined && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Distance from"}
					value={filters.filterByDistanceMinimum + "mi"}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByDistanceMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByDistanceMaximum !== undefined && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Distance to"}
					value={filters.filterByDistanceMaximum + "mi"}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByDistanceMaximum: undefined,
							}),
						);
					}}
				/>
			)}

			{filters.filterByDivisions && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Divisions"}
					value={filters.filterByDivisions?.length + "x selected"}
					tooltip={divisionNames}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByDivisions: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByRegions && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Regions"}
					value={filters.filterByRegions?.length + "x selected"}
					tooltip={regionNames}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByRegions: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterBySkillCategoryRef && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Attributes category"}
					value={
						skillCategories.find((e) => e.id === filters.filterBySkillCategoryRef)
							?.name ?? "Unknown"
					}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterBySkillCategoryRef: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterBySkills && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Attributes"}
					tooltip={skillsNames}
					value={filters.filterBySkills?.length + "x selected"}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterBySkills: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByStaff && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Staff"}
					value={filters.filterByStaff?.length + "x selected"}
					onClick={() => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByStaff: undefined,
							}),
						);
					}}
				/>
			)}
		</div>
	);
};
