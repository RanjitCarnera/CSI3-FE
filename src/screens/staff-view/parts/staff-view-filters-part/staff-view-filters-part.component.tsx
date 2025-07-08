import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { Panel, type PanelHeaderTemplateOptions } from "primereact/panel";
import { TabPanel, TabView } from "primereact/tabview";
import { classNames } from "primereact/utils";
import React, { Fragment, type HTMLAttributes, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { ExecutivesSelect } from "@components/executives-select";
import { ProjectsSelect } from "@components/projects-select/projects-select.component";
import { AssignmentRolesSelect } from "@components/relay/AssignmentRolesSelect";
import { DivisionsSelect } from "@components/relay/DivisionsSelect";
import { PeopleSelect } from "@components/relay/people-select";
import { ProjectStagesSelect } from "@components/relay/ProjectStagesSelect";
import { RegionsSelect } from "@components/relay/RegionsSelect";
import { formatCurrency } from "@components/ui/CurrencyDisplay";
import { FilterTag } from "@components/ui/filter-tag";
import { TkButton } from "@components/ui/TkButton";
import { TkInputText } from "@components/ui/TkInputText";
import { UtilizationStatusSelect } from "@components/ui/UtilizationStatusSelect";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	clearStaffViewFilters,
	selectStaffViewFilters,
	setStaffViewFilters,
} from "@redux/StaffViewSlice";
import { type staffViewFiltersPart_QueryFragment$key } from "@relay/staffViewFiltersPart_QueryFragment.graphql";
import { type staffViewFiltersPart_ScenarioFragment$key } from "@relay/staffViewFiltersPart_ScenarioFragment.graphql";
import { StaffViewAssignmentTagsFilter } from "@screens/staff-view/parts/assignment-tags-filter";
import { FromToFilters } from "@screens/staff-view/parts/from-to-filters";
import {
	PeopleFilterDivisionsReset,
	PeopleFilterDivisionsSelect,
} from "@screens/staff-view/parts/staff-view-filters-part/parts/people-filter-division";
import {
	PeopleFilterRegionReset,
	PeopleFilterRegionsSelect,
} from "@screens/staff-view/parts/staff-view-filters-part/parts/people-filter-region/people-filter-region.component";
import {
	PeopleFilterAssignmentStatusReset,
	PeopleFilterSkillsReset,
	PeopleFilterSkillsSelect,
} from "@screens/staff-view/parts/staff-view-filters-part/parts/people-filter-skills";
import { QUERY_FRAGMENT, SCENARIO_FRAGMENT } from "./staff-view-filters-part.graphql";

interface Props extends HTMLAttributes<HTMLDivElement> {
	queryRef: staffViewFiltersPart_QueryFragment$key;
	scenarioFragmentRef: staffViewFiltersPart_ScenarioFragment$key;
}

export const StaffViewFiltersPart = ({ queryRef, scenarioFragmentRef, ...props }: Props) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	const ref = useRef<OverlayPanel>(null);
	const scenario = useFragment<staffViewFiltersPart_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const hasReadSalaryPermission = hasPermissions(["UserInAccountPermission_Salary_Read"]);
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
	} = useFragment<staffViewFiltersPart_QueryFragment$key>(QUERY_FRAGMENT, queryRef);
	const regions = regionEdges!.map((e) => e!.node);
	const divisions = divisionEdges!.map((e) => e!.node);
	const assignmentRoles = assignmentRoleEdges!.map((e) => e!.node);
	const utilizations = Array.from(
		new Set(scenario.utilization.personUtilizations.map((e) => e.status).flat()).keys(),
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
	const currentlyAssignedRolesNames = assignmentRoles
		.filter((d) => filters.filterByCurrentlyAssignedAssignmentRoles?.includes(d.id))
		.map((d) => d.name)
		.join(", ");
	const utilizationNames = utilizations
		.filter((e) => filters.filterByUtilizationStatus?.includes(e))
		.join(", ");

	const handleToggleModalVisibility = (e: any) => {
		ref.current?.toggle(e);
	};

	const NameFilterComponent = (
		<div className="field">
			<span className="p-input-icon-left w-12">
				<i className="pi pi-search" />
				<TkInputText
					placeholder={"Search by Name"}
					value={filters.filterByPersonName ?? ""}
					onChange={(e) => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByPersonName: e.target.value || undefined,
							}),
						);
					}}
				/>
			</span>
		</div>
	);

	const DivisionFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"division-filter"}>Division</label>
			<br />
			<Suspense>
				<DivisionsSelect
					placeholder="Filter by division"
					fieldName="division-filter"
					fieldValue={filters.filterByDivisions}
					updateField={(u) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByDivisions: u?.length ? u : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);
	const StageFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"stage-filter"}>Stage</label>
			<br />
			<Suspense>
				<ProjectStagesSelect
					placeholder="Filter by stage"
					fieldName="stage-filter"
					fieldValue={filters.filterByStages}
					updateField={(u) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByStages: u?.length ? u : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);
	const RegionFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"region-filter"}>Region</label>
			<br />
			<Suspense>
				<RegionsSelect
					placeholder={"Filter by regions"}
					fieldName="region-filter"
					fieldValue={filters.filterByRegions}
					updateField={(u) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByRegions: u?.length ? u : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);

	const ProjectsFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"projects"}>Projects</label>
			<br />
			<Suspense>
				<ProjectsSelect
					fieldName="projects"
					fieldValue={filters.filterByProjects}
					placeholder={"Filter by projects"}
					updateField={(e) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByProjects: e?.length ? e : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);

	const JobTitleFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"assignment-roles-filter"}>Job Title</label>
			<br />
			<Suspense>
				<AssignmentRolesSelect
					fieldName="assignment-roles-filter"
					fieldValue={filters.filterByAssignmentRoles}
					placeholder={"Filter by job title"}
					updateField={(e) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAssignmentRoles: e?.length ? e : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);
	const CurrentlyAssignedRolesFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"assignment-roles-filter"}>Currently Assigned Roles</label>
			<br />
			<Suspense>
				<AssignmentRolesSelect
					fieldName="currently-assigned-roles-filter"
					fieldValue={filters.filterByCurrentlyAssignedAssignmentRoles}
					placeholder={"Filter by currently assigned roles"}
					updateField={(e) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByCurrentlyAssignedAssignmentRoles: e?.length ? e : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);

	const StaffFilterComponent = (
		<div className="field mr-2">
			<label htmlFor={"skills-staff"}>Staff</label>
			<br />
			<Suspense>
				<PeopleSelect
					fieldName={"skills-staff"}
					fieldValue={filters.filterByStaff}
					placeholder={"Filter by Staff"}
					updateField={(e) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByStaff: e?.length ? e?.filter((i) => i !== null) : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);

	const UtilizationFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"assignment-roles-filter"}>Utilization</label>
			<br />
			<UtilizationStatusSelect
				fieldValue={filters.filterByUtilizationStatus}
				placeholder={"Filter by utilization status"}
				updateField={(e) => {
					dispatch(
						setStaffViewFilters({
							...filters,
							filterByUtilizationStatus: e?.length ? e : undefined,
						}),
					);
				}}
			/>
		</div>
	);

	const SalaryFromFilterComponent = hasReadSalaryPermission ? (
		<div className="field mr-2">
			<label htmlFor={"salary-from-filter"}>Salary from</label>
			<br />
			<InputNumber
				name="salary-from-filter"
				value={filters.filterBySalaryMinimum}
				placeholder={"Salary from..."}
				onChange={(e) =>
					dispatch(
						setStaffViewFilters({
							...filters,
							filterBySalaryMinimum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	) : (
		<></>
	);
	const SalaryToFilterComponent = hasReadSalaryPermission ? (
		<div className="field mr-2">
			<label htmlFor={"salary-to-filter"}>Salary to</label>
			<br />
			<InputNumber
				name="salary-to-filter"
				value={filters.filterBySalaryMaximum}
				placeholder={"... salary to"}
				onChange={(e) =>
					dispatch(
						setStaffViewFilters({
							...filters,
							filterBySalaryMaximum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	) : (
		<></>
	);

	const GapDaysFromFilterComponent = gapDaysEnabled && (
		<div className="field mr-2">
			<label htmlFor={"gap-days-from-filter"}>Gap days from</label>
			<br />
			<InputNumber
				name="gap-days-from-filter"
				value={filters.filterByGapDaysMinimum}
				placeholder={"Gap days from..."}
				onChange={(e) =>
					dispatch(
						setStaffViewFilters({
							...filters,
							filterByGapDaysMinimum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	);
	const GapDaysToFilterComponent = gapDaysEnabled && (
		<div className="field mr-2">
			<label htmlFor={"gap-days-to-filter"}>Gap days to</label>
			<br />
			<InputNumber
				name="gap-days-to-filter"
				value={filters.filterByGapDaysMaximum}
				placeholder={"... gap days to"}
				onChange={(e) =>
					dispatch(
						setStaffViewFilters({
							...filters,
							filterByGapDaysMaximum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	);

	const ExecutiveComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"executive"}>Executives</label>
			<br />
			<ExecutivesSelect
				scenarioId={scenario.id}
				placeholder="Filter by executives"
				fieldValue={filters.filterByExecutives}
				updateField={(u) => {
					dispatch(
						setStaffViewFilters({
							...filters,
							filterByExecutives: u?.length ? u : undefined,
						}),
					);
				}}
			/>
		</div>
	);

	const AssignmentStatusComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"assignment-status"}>Assignment Status</label>
			<br />
			<Dropdown
				name="assignment-status"
				placeholder="Either"
				options={[
					{ label: "Either assigned or empty", value: "Either" },
					{ label: "Only assigned", value: "Assigned" },
					{ label: "Only empty", value: "Empty" },
				]}
				value={filters.filterByAssignmentStatus}
				onChange={(e) => {
					dispatch(
						setStaffViewFilters({
							...filters,
							filterByAssignmentStatus: e.value ?? undefined,
						}),
					);
				}}
			/>
		</div>
	);

	const ResetFiltersComponent = (
		<div className="">
			<TkButton
				disabled={Object.entries(filters).length === 0}
				label="Reset filters"
				onClick={() => {
					dispatch(clearStaffViewFilters());
				}}
			/>
		</div>
	);
	const headerTemplate = (options: PanelHeaderTemplateOptions) => {
		const className = `${options.className} justify-content-between`;
		return (
			<div className={className}>
				<span>Filters</span>
				{ResetFiltersComponent}
			</div>
		);
	};

	return (
		<div
			className={classNames({
				[props.className || ""]: true,
				flex: true,
				"hide-print": true,
			})}
			style={{
				gap: "0.5rem",
				...props.style,
			}}
		>
			{NameFilterComponent}

			<TkButton
				onClick={handleToggleModalVisibility}
				label={"Show filters"}
				icon={"pi pi-filter"}
				style={{ flexGrow: 0, flexShrink: 0, height: "min-content" }}
			/>

			<FromToFilters />
			<OverlayPanel ref={ref} showCloseIcon style={{ minWidth: "30%", width: "min-content" }}>
				<Panel headerTemplate={headerTemplate} header="Filters">
					<TabView>
						<TabPanel header="Resource filters">
							<p className="m-0 flex flex-wrap">
								{CurrentlyAssignedRolesFilterComponent}
								{UtilizationFilterComponent}
								{SalaryFromFilterComponent}
								{SalaryToFilterComponent}
								{GapDaysFromFilterComponent}
								{GapDaysToFilterComponent}
								{StaffFilterComponent}
								{JobTitleFilterComponent}
								{AssignmentStatusComponent}
								<StaffViewAssignmentTagsFilter />
								<PeopleFilterRegionsSelect />
								<PeopleFilterDivisionsSelect />
								<PeopleFilterSkillsSelect />
							</p>
						</TabPanel>
						<TabPanel header="Project filters">
							<p className="m-0 flex flex-wrap">
								{ProjectsFilterComponent}
								{DivisionFilterComponent}
								{RegionFilterComponent}
								{StageFilterComponent}
								{ExecutiveComponent}
							</p>
						</TabPanel>
					</TabView>
				</Panel>
			</OverlayPanel>
			{[
				filters.filterByPersonName,
				filters.filterByDivisions,
				filters.filterByRegions,
				filters.filterByAssignmentRoles,
				filters.filterByCurrentlyAssignedAssignmentRoles,
				filters.filterByUtilizationStatus,
				filters.filterByAllocatedDateMinimum,
				filters.filterByAllocatedDateMaximum,
				filters.filterByAssignmentDateMinimum,
				filters.filterByAssignmentDateMaximum,
				filters.filterBySalaryMinimum,
				filters.filterBySalaryMaximum,
				filters.filterByGapDaysMinimum,
				filters.filterByGapDaysMaximum,
				filters.filterByStaff,
				filters.filterByExecutives,
				filters.filterByProjects,
				filters.filterByAssignmentTags,
				filters.peopleFilterRegion,
				filters.peopleFilterDivision,
				filters.peopleFilterSkills,
				filters.filterByAssignmentStatus,
			].some((e) => {
				if (e === "ByNameAsc") return false;
				return e !== undefined;
			}) && ResetFiltersComponent}

			<PeopleFilterRegionReset />
			<PeopleFilterDivisionsReset />
			<PeopleFilterSkillsReset />
			<PeopleFilterAssignmentStatusReset />
			{filters.filterByDivisions && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Divisions"}
					tooltip={divisionNames}
					value={filters.filterByDivisions.length + " selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
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
					tooltip={regionNames}
					value={filters.filterByRegions.length + " selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByRegions: undefined,
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
					value={filters.filterByAssignmentRoles.length + " selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAssignmentRoles: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByCurrentlyAssignedAssignmentRoles && (
				<FilterTag
					header={"Currently Assigned Assigment Roles"}
					icon={"pi pi-times"}
					tooltip={currentlyAssignedRolesNames}
					value={filters.filterByCurrentlyAssignedAssignmentRoles.length + " selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByCurrentlyAssignedAssignmentRoles: undefined,
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
					value={filters.filterByUtilizationStatus.length + " selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByUtilizationStatus: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByAllocatedDateMinimum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Resource allocated from"}
					value={filters.filterByAllocatedDateMinimum}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAllocatedDateMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByStaff && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Resources filterd by"}
					value={filters.filterByStaff?.length + "x selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByStaff: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByAllocatedDateMaximum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Resource allocated until"}
					value={filters.filterByAllocatedDateMaximum}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAllocatedDateMaximum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByAssignmentDateMinimum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Assignment from"}
					value={filters.filterByAssignmentDateMinimum}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAssignmentDateMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByAssignmentDateMaximum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Assignment until"}
					value={filters.filterByAssignmentDateMaximum}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAssignmentDateMaximum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterBySalaryMinimum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Salary from"}
					value={formatCurrency(filters.filterBySalaryMinimum)}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterBySalaryMinimum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterBySalaryMaximum && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Salary until"}
					value={formatCurrency(filters.filterBySalaryMaximum)}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
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
							setStaffViewFilters({
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
					header={"Gap days until"}
					value={filters.filterByGapDaysMaximum + ""}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByGapDaysMaximum: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByExecutives && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Executives"}
					value={filters.filterByExecutives?.length + "x selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByExecutives: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByProjects && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Projects"}
					value={filters.filterByProjects?.length + "x selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByProjects: undefined,
							}),
						);
					}}
				/>
			)}
			{filters.filterByAssignmentTags && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Assignment Tags"}
					value={filters.filterByAssignmentTags?.length + "x selected"}
					onClick={() => {
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAssignmentTags: undefined,
							}),
						);
					}}
				/>
			)}
		</div>
	);
};
