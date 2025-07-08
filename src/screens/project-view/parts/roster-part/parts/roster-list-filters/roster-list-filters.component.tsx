import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { Panel, type PanelHeaderTemplateOptions } from "primereact/panel";
import { classNames } from "primereact/utils";
import React, { type HTMLAttributes, type MouseEvent, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AssignmentRolesSelect } from "@components/relay/AssignmentRolesSelect";
import { DivisionsSelect } from "@components/relay/DivisionsSelect";
import { PeopleSelect } from "@components/relay/people-select";
import { RegionsSelect } from "@components/relay/RegionsSelect";
import { SkillCategorySelect } from "@components/relay/SkillCategorySelect";
import { SkillsSelect } from "@components/relay/SkillsSelect";
import { DefaultSalaryComponent } from "@components/ui/DefaultTextInput";
import { TkButton } from "@components/ui/TkButton";
import { UtilizationStatusSelect } from "@components/ui/UtilizationStatusSelect";
import { selectBudgetDisplay, selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	selectScenarioPeopleFilters,
	selectSelectedProjectId,
	setProjectViewPeopleFilters,
} from "@redux/ProjectViewSlice";
import { FromToFilters } from "@screens/project-view/parts/from-to-filters";

export const RosterListFilters = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
	const filters = useSelector(selectScenarioPeopleFilters) || {};
	const selectedProjectId = useSelector(selectSelectedProjectId);
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);
	const ref = useRef<OverlayPanel>(null);
	const dispatch = useDispatch();
	const handleToggleModalVisibility = (e: MouseEvent<HTMLButtonElement>) => {
		ref.current?.toggle(e);
	};
	const hasReadSalaryPermission = hasPermissions(["UserInAccountPermission_Salary_Read"]);
	const budgetDisplay = useSelector(selectBudgetDisplay);
	const hasShowBudget = budgetDisplay !== "None";
	const showSalaryFilters = hasReadSalaryPermission && hasShowBudget;

	const JobTitleFilterComponent = (
		<div className="field">
			<label htmlFor={"assignment-roles-filter"}>Job Title</label>
			<br />
			<Suspense>
				<AssignmentRolesSelect
					fieldName="assignment-roles-filter"
					fieldValue={filters.filterByAssignmentRoles}
					placeholder={"Filter by assignment roles"}
					updateField={(e) =>
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByAssignmentRoles: e?.length ? e : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);
	const UtilizationFilterComponent = (
		<div className="field">
			<label htmlFor={"assignment-roles-filter"}>Utilization</label>
			<br />
			<UtilizationStatusSelect
				fieldValue={filters.filterByUtilizationStatus}
				placeholder={"Filter by utilization status"}
				updateField={(e) => {
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByUtilizationStatus: e?.length ? e : undefined,
						}),
					);
				}}
			/>
		</div>
	);

	const SalaryFromFilterComponent = showSalaryFilters && (
		<div className="field">
			<label htmlFor={"salary-from-filter"}>Salary from</label>
			<br />
			<DefaultSalaryComponent
				fieldName="salary-from-filter"
				fieldValue={filters.filterBySalaryMinimum}
				placeholder={"Salary from..."}
				isValid={true}
				updateField={(e) =>
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterBySalaryMinimum: e ?? undefined,
						}),
					)
				}
			/>
		</div>
	);
	const SalaryToFilterComponent = showSalaryFilters && (
		<div className="field">
			<label htmlFor={"salary-to-filter"}>Salary to</label>
			<br />
			<DefaultSalaryComponent
				fieldName="salary-to-filter"
				fieldValue={filters.filterBySalaryMaximum}
				placeholder={"... salary to"}
				isValid={true}
				updateField={(e) =>
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterBySalaryMaximum: e ?? undefined,
						}),
					)
				}
			/>
		</div>
	);

	const GapDaysFromFilterComponent = gapDaysEnabled && (
		<div className="field">
			<label htmlFor={"gap-days-from-filter"}>Gap days from</label>
			<br />
			<InputNumber
				name="gap-days-from-filter"
				value={filters.filterByGapDaysMinimum}
				placeholder={"Gap days from..."}
				onChange={(e) =>
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByGapDaysMinimum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	);
	const GapDaysToFilterComponent = gapDaysEnabled && (
		<div className="field">
			<label htmlFor={"gap-days-to-filter"}>Gap days to</label>
			<br />
			<InputNumber
				name="gap-days-to-filter"
				value={filters.filterByGapDaysMaximum}
				placeholder={"... gap days to"}
				onChange={(e) =>
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByGapDaysMaximum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	);
	const DistanceFromFilterComponent = (
		<div className="field">
			<label htmlFor={"distance-from-filter"}>Distances from</label>
			<br />
			<InputNumber
				name="distance-from-filter"
				disabled={!selectedProjectId}
				tooltip={
					"Once you select a project by clicking on it on the right, you can filter by distance between staff member and project."
				}
				tooltipOptions={{ showOnDisabled: true }}
				value={filters.filterByDistanceMinimum}
				placeholder={"Distance from..."}
				onChange={(e) =>
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByDistanceMinimum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	);
	const DistanceToFilterComponent = (
		<div className="field">
			<label htmlFor={"distance-to-filter"}>Distance to</label>
			<br />
			<InputNumber
				name="distance-to-filter"
				disabled={!selectedProjectId}
				tooltip={
					"Once you select a project by clicking on it on the right, you can filter by distance between staff member and project."
				}
				tooltipOptions={{ showOnDisabled: true }}
				value={filters.filterByDistanceMaximum}
				placeholder={"... distance to"}
				onChange={(e) =>
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByDistanceMaximum: e.value ?? undefined,
						}),
					)
				}
			/>
		</div>
	);
	const RegionFilterComponent = (
		<div className="field">
			<label htmlFor="regions-filter">Regions</label>
			<br />
			<RegionsSelect
				fieldName={"regions-filter"}
				fieldValue={filters.filterByRegions}
				placeholder={"Filter by regions"}
				updateField={(e) => {
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByRegions: e?.length ? e : undefined,
						}),
					);
				}}
			/>
		</div>
	);
	const DivisionFilterComponent = (
		<div className="field">
			<label htmlFor="divisions-filter">Divisions</label>
			<br />
			<DivisionsSelect
				fieldName={"divisions-filter"}
				fieldValue={filters.filterByDivisions}
				placeholder={"Filter by divisions"}
				updateField={(e) => {
					dispatch(
						setProjectViewPeopleFilters({
							...filters,
							filterByDivisions: e?.length ? e : undefined,
						}),
					);
				}}
			/>
		</div>
	);
	const SkillsCategoryFilterComponent = (
		<div className="field">
			<label htmlFor={"category-skills-filter"}>Attributes Category</label>
			<br />
			<Suspense>
				<SkillCategorySelect
					fieldName={"skill-category-filter"}
					fieldValue={filters.filterBySkillCategoryRef}
					placeholder={"Filter attributes by category"}
					updateField={(e) => {
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterBySkillCategoryRef: e,
							}),
						);
					}}
				/>
			</Suspense>
		</div>
	);

	const SkillsFilterComponent = (
		<div className="field">
			<label htmlFor={"skills-filter"}>Attributes</label>
			<br />
			<Suspense>
				<SkillsSelect
					filterBySkillCategoryRef={filters.filterBySkillCategoryRef}
					fieldName={"skills-filter"}
					fieldValue={filters.filterBySkills}
					placeholder={"Filter by attributes"}
					updateField={(e) =>
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterBySkills: e,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);

	const StaffFilterComponent = (
		<div className="field">
			<label htmlFor={"skills-staff"}>Staff</label>
			<br />
			<Suspense>
				<PeopleSelect
					fieldName={"skills-staff"}
					fieldValue={filters.filterByStaff}
					placeholder={"Filter by Staff"}
					updateField={(e) =>
						dispatch(
							setProjectViewPeopleFilters({
								...filters,
								filterByStaff: e?.filter((i) => i !== null),
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
				disabled={Object.entries(filters).length === 0}
				label="Reset Filters"
				onClick={() => {
					dispatch(setProjectViewPeopleFilters({ startDate: "", endDate: "" }));
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

	const withLineBreak = (component: JSX.Element) => (
		<div
			style={{
				width: "100%",
				flexBasis: "100%",
			}}
		>
			{component}
		</div>
	);

	const flexClassName = "m-0 flex flex-wrap gap-2";
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
			<TkButton
				onClick={handleToggleModalVisibility}
				label={"show filters"}
				icon={"pi pi-filter"}
				style={{ flexGrow: 0, flexShrink: 0, height: "min-content" }}
			/>
			<OverlayPanel ref={ref} showCloseIcon style={{ width: "50%" }}>
				<Panel
					headerTemplate={headerTemplate}
					header="Filters"
					style={{ maxHeight: "80vh", overflowY: "auto" }}
				>
					<p className={flexClassName}>
						{JobTitleFilterComponent}
						{UtilizationFilterComponent}
						{withLineBreak(
							<div className={flexClassName}>
								{SalaryFromFilterComponent}
								{SalaryToFilterComponent}
							</div>,
						)}
						{withLineBreak(
							<div className={flexClassName}>
								<FromToFilters />
							</div>,
						)}
						{withLineBreak(
							<div className={flexClassName}>
								{GapDaysFromFilterComponent}
								{GapDaysToFilterComponent}
								{DistanceFromFilterComponent}
								{DistanceToFilterComponent}
							</div>,
						)}
						{withLineBreak(
							<div className={flexClassName}>
								{StaffFilterComponent}
								{RegionFilterComponent}
								{DivisionFilterComponent}
							</div>,
						)}
						{withLineBreak(
							<div className={flexClassName}>
								{SkillsCategoryFilterComponent}
								{SkillsFilterComponent}
							</div>,
						)}
					</p>
				</Panel>
			</OverlayPanel>
		</div>
	);
};
