import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Panel, type PanelHeaderTemplateOptions } from "primereact/panel";
import { TabPanel, TabView } from "primereact/tabview";
import { classNames } from "primereact/utils";
import React, { Suspense, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { DebouncedPrDropdown } from "@components/debounced-pr-dropdown";
import { DebouncedExecutivesSelect } from "@components/executives-select";
import { DebouncedAssignmentRolesSelect } from "@components/relay/AssignmentRolesSelect";
import { DebouncedDivisionsSelect } from "@components/relay/DivisionsSelect";
import { DebouncedPeopleSelect } from "@components/relay/people-select";
import { DebouncedProjectStagesSelect } from "@components/relay/ProjectStagesSelect";
import { DebouncedRegionsSelect } from "@components/relay/RegionsSelect";
import { SkillCategorySelect } from "@components/relay/SkillCategorySelect";
import { DebouncedSkillsSelect } from "@components/relay/SkillsSelect";
import { DebouncedDefaultCalendarComponent } from "@components/ui/DefaultTextInput";
import { FilterTag } from "@components/ui/filter-tag";
import { TkButton } from "@components/ui/TkButton";
import {
	selectScenarioProjectFilters,
	selectShowPast,
	setProjectViewProjectFilters,
	setShowPast,
	type Sorting,
	sortingOptions,
	type Staffing,
} from "@redux/ProjectViewSlice";
import type { projectViewFiltersPart_QueryFragment$key } from "@relay/projectViewFiltersPart_QueryFragment.graphql";
import { type projectViewFiltersPart_ScenarioFragment$key } from "@relay/projectViewFiltersPart_ScenarioFragment.graphql";
import { type AssignmentStatus } from "@relay/staffViewPart_Query.graphql";
import { FromToFilters } from "@screens/project-view/parts/from-to-filters";
import { ProjectViewAssignmentTagsFilter } from "@screens/project-view/parts/project-view-filters-part/parts/assignment-tags-filter/assignment-tags-filter.component";
import {
	ProjectViewUtilizationStatusFilter,
	ProjectViewUtilizationStatusReset,
} from "@screens/project-view/parts/project-view-filters-part/parts/people-filter-utilization-status";
import {
	QUERY_FRAGMENT,
	SCENARIO_FRAGMENT,
} from "@screens/project-view/parts/project-view-filters-part/project-view-filters-part.graphql";
import { type ProjectViewFiltersPartProps } from "@screens/project-view/parts/project-view-filters-part/project-view-filters-part.types";
import { ProjectViewNameFilter } from "@screens/project-view/parts/project-view-name-filter";

export const ProjectViewFiltersPart = ({
	queryRef,
	scenarioFragment,
	...props
}: ProjectViewFiltersPartProps) => {
	const [refetchKey, setRefetchKey] = useState(0);
	const showPast = useSelector(selectShowPast);
	const projectFilters = useSelector(selectScenarioProjectFilters);
	const scenario = useFragment<projectViewFiltersPart_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragment,
	);
	const dispatch = useDispatch();
	const ref = useRef<OverlayPanel>(null);
	const {
		Project: {
			ProjectStages: { edges: stageEdges },
		},
		Region: {
			Regions: { edges: regionEdges },
		},
		Division: {
			Divisions: { edges: divisionEdges },
		},
	} = useFragment<projectViewFiltersPart_QueryFragment$key>(QUERY_FRAGMENT, queryRef);
	const stages = stageEdges!.map((e) => e!.node);
	const regions = regionEdges!.map((e) => e!.node);
	const divisions = divisionEdges!.map((e) => e!.node);

	const divisionNames = divisions
		.filter((d) => projectFilters.filterByDivisions?.includes(d.id))
		.map((d) => d.name)
		.join(", ");
	const regionNames = regions
		.filter((d) => projectFilters.filterByRegions?.includes(d.id))
		.map((d) => d.name)
		.join(", ");

	interface Response {
		id: string;
		name: string;
	}

	const getNameById = (arr: Response[], ids: string[]) =>
		arr
			.filter((s) => ids.includes(s.id))
			?.map((e) => e.name)
			.join(", ") ?? "Unknown";

	const handleToggleModalVisibility = (e: any) => {
		ref.current?.toggle(e);
	};

	const NameFilterComponent = (
		<div>
			<span className="p-input-icon-left w-12">
				<i className="pi pi-search" />
				<InputText
					name="name-filter"
					placeholder={"Search by Project Name"}
					value={projectFilters.filterByName}
					onChange={(e) =>
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByName: e.target.value,
							}),
						)
					}
				/>
			</span>
		</div>
	);
	const DivisionFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"division-filter"}>Division</label>
			<br />
			<DebouncedDivisionsSelect
				fieldName="division-filter"
				fieldValue={projectFilters.filterByDivisions}
				placeholder="Filter by division"
				updateField={(u) =>
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByDivisions: u,
						}),
					)
				}
			/>
		</div>
	);
	const RegionFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"region-filter"}>Region</label>
			<br />
			<DebouncedRegionsSelect
				placeholder={"Filter by regions"}
				fieldName="region-filter"
				fieldValue={projectFilters.filterByRegions}
				updateField={(u) =>
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByRegions: u,
						}),
					)
				}
			/>
		</div>
	);

	const StageFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"stage-filter"}>Stages</label>
			<br />
			<DebouncedProjectStagesSelect
				placeholder={"Filter by stages"}
				fieldName="stage-filter"
				fieldValue={projectFilters.filterByStage}
				updateField={(u) =>
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByStage: u,
						}),
					)
				}
			/>
		</div>
	);

	const StaffingComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"staffing-filter"}>Staffing</label>
			<br />
			<DebouncedPrDropdown<Staffing>
				name="staffing-filter"
				placeholder="Either staffing"
				options={[
					{ label: "Either staffing", value: null },
					{ label: "Not fully staffed", value: "Not Fully Staffed" },
					{ label: "Fully staffed", value: "Fully staffed" },
				]}
				value={projectFilters.filterByStaffing}
				onChange={(e) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByStaffing: e,
						}),
					);
				}}
			/>
		</div>
	);

	const DateFromComponent = (
		<div className="field mr-2">
			<label htmlFor={"project-from-filter"}>Date from</label>
			<DebouncedDefaultCalendarComponent
				fieldName="project-from-filter"
				fieldValue={projectFilters.filterByDateFrom}
				isValid={true}
				placeholder={"Date from..."}
				updateField={(e) =>
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByDateFrom: e?.length ? e : undefined,
						}),
					)
				}
			/>
		</div>
	);
	const FreeUntilComponent = (
		<div className="field mr-2">
			<label htmlFor={"project-until-filter"}>Date until</label>
			<DebouncedDefaultCalendarComponent
				fieldName="free-until-filter"
				fieldValue={projectFilters.filterByDateTo}
				isValid={true}
				placeholder={"... date until"}
				updateField={(e) =>
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByDateTo: e?.length ? e : undefined,
						}),
					)
				}
			/>
		</div>
	);

	const SortingComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"staffing-filter"}>Sorting</label>
			<br />
			<DebouncedPrDropdown<Sorting>
				name="sorting-filter"
				options={
					[
						{ label: "By name - ascending", value: "ByNameAsc" },
						{ label: "By name - descending", value: "ByNameDesc" },
						{ label: "By start date - ascending", value: "ByStartDateAsc" },
						{
							label: "By start date - descending",
							value: "ByStartDateDesc",
						},
						{ label: "By end date - ascending", value: "ByEndDateAsc" },
						{ label: "By end date - descending", value: "ByEndDateDesc" },
					] as Array<{ label: string; value: Sorting | null }>
				}
				value={projectFilters.sorting}
				onChange={(e) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							sorting: e,
						}),
					);
				}}
			/>
		</div>
	);

	const ShowPastComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<div>
				<label htmlFor={"show-past-filter"}>Show past</label>
			</div>
			<InputSwitch
				className="mt-2 ml-2"
				name="show-past-filter"
				checked={showPast}
				placeholder={"... salary to"}
				onChange={(e) => dispatch(setShowPast(e.value))}
			/>
		</div>
	);

	const ExecutiveComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<div>
				<label htmlFor={"executive"}>Executives</label>
			</div>
			<DebouncedExecutivesSelect
				placeholder="Filter by executives"
				fieldValue={projectFilters.filterByExecutives}
				scenarioId={scenario.id}
				updateField={(u) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
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
			<DebouncedPrDropdown<AssignmentStatus>
				name="assignment-status"
				placeholder="Either"
				options={[
					{ label: "Either assigned or empty", value: "Either" },
					{ label: "Only assigned", value: "Assigned" },
					{ label: "Only empty", value: "Empty" },
				]}
				value={projectFilters.filterByAssignmentStatus}
				onChange={(e) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByAssignmentStatus: e ?? undefined,
						}),
					);
				}}
			/>
		</div>
	);

	const AssignmentRoleComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<div>
				<label htmlFor={"assignment-roles"}>Assignment roles</label>
			</div>
			<DebouncedAssignmentRolesSelect
				placeholder="Filter by assignment roles"
				fieldValue={projectFilters.filterByAssignmentRoles}
				updateField={(u) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByAssignmentRoles: u?.length ? u : undefined,
						}),
					);
				}}
			/>
		</div>
	);
	const StaffComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<div>
				<label htmlFor={"assignment-roles"}>Staff</label>
			</div>
			<DebouncedPeopleSelect
				placeholder="Filter by staff"
				fieldValue={projectFilters.filterByStaff}
				updateField={(u) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByStaff: u?.length ? u : undefined,
						}),
					);
				}}
			/>
		</div>
	);
	const SkillsCategoryFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"category-skills-filter"}>Attributes Category</label>
			<br />
			<Suspense>
				<SkillCategorySelect
					fieldName={"skill-category-filter"}
					fieldValue={projectFilters.filterBySkillCategoryRef}
					placeholder={"Filter attributes by category"}
					updateField={(e) => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterBySkillCategoryRef: e,
							}),
						);
					}}
				/>
			</Suspense>
		</div>
	);

	const SkillsFilterComponent = (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"skills-filter"}>Attributes</label>
			<br />
			<Suspense>
				<DebouncedSkillsSelect
					filterBySkillCategoryRef={projectFilters.filterBySkillCategoryRef}
					fieldName={"skills-filter"}
					fieldValue={projectFilters.filterBySkills}
					placeholder={"Filter by attributes"}
					updateField={(e) =>
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterBySkills: e,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);

	const ResetFiltersComponent = (
		<div className="">
			<TkButton
				disabled={
					Object.entries(projectFilters).length === 1 &&
					projectFilters.sorting === "ByNameAsc"
				}
				label="Reset Filters"
				onClick={() => {
					setRefetchKey((k) => k + 1);
					dispatch(
						setProjectViewProjectFilters({
							filterByName: "",
							sorting: "ByNameAsc",
						}),
					);
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
				[props.className ?? ""]: true,
				flex: true,
			})}
			style={{
				gap: "0.5rem",
				...props.style,
			}}
		>
			<ProjectViewNameFilter />
			<TkButton
				onClick={handleToggleModalVisibility}
				label={"Show filters"}
				icon={"pi pi-filter"}
				style={{ flexGrow: 0, flexShrink: 0, height: "min-content" }}
			/>
			<OverlayPanel ref={ref} showCloseIcon style={{ width: "30%" }}>
				<Panel
					headerTemplate={headerTemplate}
					header="Filters"
					style={{ maxHeight: "90vh", overflow: "auto" }}
				>
					<TabView>
						<TabPanel header="Projects filters">
							<p className="m-0 flex flex-wrap">
								{StageFilterComponent}
								{DivisionFilterComponent}
								{RegionFilterComponent}
								{StaffingComponent}
								{DateFromComponent}
								{FreeUntilComponent}
								{SortingComponent}
								{ShowPastComponent}
								{ExecutiveComponent}
							</p>
						</TabPanel>
						<TabPanel header="Resource filters">
							<p className="m-0 flex flex-wrap">
								{AssignmentRoleComponent}
								{StaffComponent}
								{SkillsCategoryFilterComponent}
								{SkillsFilterComponent}
								<div className="mr-2" style={{ minWidth: 500 }}>
									<FromToFilters
										key={"expiration-date-" + refetchKey}
										initialState={{
											startDate:
												projectFilters.filterBySkillExpirationDate?.from,
											endDate: projectFilters.filterBySkillExpirationDate?.to,
										}}
										needsBoth={false}
										onChange={(newValue) => {
											dispatch(
												setProjectViewProjectFilters({
													...projectFilters,
													filterBySkillExpirationDate:
														!!newValue.startDate || !!newValue.endDate
															? {
																	from: newValue.startDate,
																	to: newValue.endDate,
															  }
															: undefined,
												}),
											);
										}}
										label={"Skill expiration date"}
									/>
								</div>
								{AssignmentStatusComponent}
								<ProjectViewAssignmentTagsFilter />
								<ProjectViewUtilizationStatusFilter />
							</p>
						</TabPanel>
					</TabView>
				</Panel>
			</OverlayPanel>

			{[
				projectFilters.filterByName,
				projectFilters.filterByDateFrom,
				projectFilters.filterByDateTo,
				projectFilters.filterByDivisions,
				projectFilters.filterByStage,
				projectFilters.filterByRegions,
				projectFilters.filterByStaffing,
				projectFilters.sorting,
				projectFilters.filterByExecutives,
				projectFilters.filterByAssignmentRoles,
				projectFilters.filterByStaff,

				projectFilters.filterByAssignmentStatus,
				projectFilters.filterByAssignmentRoles,
				projectFilters.filterBySkills,
				projectFilters.filterByAssignmentTags,
				projectFilters.peopleFilterUtilizationStatus,
				showPast,
			].some((e) => {
				if (e === "ByNameAsc") return false;
				if (e === false) return false;
				return e !== undefined;
			}) && ResetFiltersComponent}

			{projectFilters.sorting && (
				<FilterTag
					header={"Sorting"}
					id={"filter-tag-sorting"}
					value={
						sortingOptions.find((e) => e.value === projectFilters.sorting)?.label ??
						"Sorting Option Not Found"
					}
					onClick={handleToggleModalVisibility}
				/>
			)}
			<ProjectViewUtilizationStatusReset />
			{projectFilters.filterByDateFrom && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Date from"}
					value={projectFilters.filterByDateFrom}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByDateFrom: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByDateTo && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Date until"}
					value={projectFilters.filterByDateTo}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByDateTo: undefined,
							}),
						);
					}}
				/>
			)}

			{projectFilters.filterByDivisions && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Divisions"}
					tooltip={divisionNames}
					value={projectFilters.filterByDivisions.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByDivisions: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByStage && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Stage"}
					value={getNameById(stages, projectFilters.filterByStage)}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByStage: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByRegions && (
				<FilterTag
					header={"Regions"}
					icon={"pi pi-times"}
					tooltip={regionNames}
					value={projectFilters.filterByRegions.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByRegions: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByStaffing && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Staffing"}
					value={projectFilters.filterByStaffing}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByStaffing: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByStaff && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Staff"}
					value={projectFilters.filterByStaff.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByStaff: undefined,
							}),
						);
					}}
				/>
			)}

			{showPast && (
				<FilterTag
					icon={"pi pi-times"}
					header={"Past"}
					value={showPast ? "True" : "False"}
					onClick={() => {
						dispatch(setShowPast(false));
					}}
				/>
			)}
			{projectFilters.filterByExecutives && (
				<FilterTag
					header={"Executives"}
					icon={"pi pi-times"}
					value={projectFilters.filterByExecutives?.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByExecutives: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByAssignmentStatus && (
				<FilterTag
					header={"Assignment status"}
					icon={"pi pi-times"}
					value={projectFilters.filterByAssignmentStatus}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByAssignmentStatus: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByAssignmentRoles && (
				<FilterTag
					header={"Assignment roles"}
					icon={"pi pi-times"}
					value={projectFilters.filterByAssignmentRoles.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByAssignmentRoles: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterBySkills && (
				<FilterTag
					header={"Attributes"}
					icon={"pi pi-times"}
					value={projectFilters.filterBySkills.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterBySkills: undefined,
							}),
						);
					}}
				/>
			)}
			{projectFilters.filterByAssignmentTags && (
				<FilterTag
					header={"Assignment tags"}
					icon={"pi pi-times"}
					value={projectFilters.filterByAssignmentTags.length + " selected"}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByAssignmentTags: undefined,
							}),
						);
					}}
				/>
			)}
		</div>
	);
};
