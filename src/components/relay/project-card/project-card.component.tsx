import { Tooltip } from "@thekeytechnology/framework-react-components";
import moment from "moment-timezone";
import { classNames } from "primereact/utils";
import React, { useId, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Conditional } from "@components/conditional";
import { ContextMenu } from "@components/context-menu";
import {
	ContextMenuKind,
	type ContextMenuOption,
	type ContextMenuOptionOverride,
} from "@components/context-menu/context-menu.types";

import { CheckScenarioPermissions } from "@components/relay/CheckScenarioPermissions";
import { AssignmentsInProject } from "@components/relay/project-card/parts/assignments-in-project/assignments-in-project.component";
import { EditProjectInScenarioButton } from "@components/relay/project-card/parts/edit-project-in-scenario-button";
import { RemoveProjectFromScenarioButton } from "@components/relay/project-card/parts/remove-project-from-scenario-button";
import { SyncAssignmentsCucButton } from "@components/relay/project-card/parts/sync-assignments-cuc-button";
import { ProjectDetailsButton } from "@components/relay/project-details-button";
import { RemovePeopleFromAssignmentsButtonComponent } from "@components/relay/remove-people-from-assignments-button";
import { selectCurrentUser, selectHasPermissions } from "@redux/CurrentUserSlice";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";
import {
	selectIsProjectsExpanded,
	selectSelectedProjectId,
	setSelectedProjectId,
} from "@redux/ProjectViewSlice";
import { SCENARIO_MAP_VIEW_SCREEN_ROUTE } from "@screens/map-view/ScenarioMapViewScreen";
import { truncateString } from "@utils/string-utils";
import { useUseStageColorsForProjectNames } from "@utils/use-stage-colors-for-project-names.hook";
import {
	PROJECT_FRAGMENT,
	PROJECT_RETRIEVE_GPS_MUTATION,
	SCENARIO_FRAGMENT,
} from "./project-card.graphql";
import { type ProjectCardProps } from "./project-card.interface";
import { type projectCard_ProjectFragment$key } from "../../../__generated__/projectCard_ProjectFragment.graphql";
import { type projectCard_ScenarioFragment$key } from "../../../__generated__/projectCard_ScenarioFragment.graphql";
import { AddressDisplay } from "../../ui/AddressDisplay";
import { CurrencyDisplay } from "../../ui/CurrencyDisplay";
import { TkCard } from "../../ui/TkCard";
import { ProjectDateTimeDisplay } from "../ProjectDateTimeDisplay";

export const ProjectCard = React.memo(
	({ style, scenarioFragmentRef, projectFragmentRef }: ProjectCardProps) => {
		const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
		const isUsingCUC = activeFeatureToggleIds.includes("CUC");
		const cu = useSelector(selectCurrentUser);
		const shouldShowBudgeted = ["BudgetedOnly", "BudgetedAndUtilized"].includes(
			cu?.user.extension.budgetDisplay ?? "None",
		);
		const shouldShowUtilized = ["UtilizedOnly", "BudgetedAndUtilized"].includes(
			cu?.user.extension.budgetDisplay ?? "None",
		);
		const scenario = useFragment<projectCard_ScenarioFragment$key>(
			SCENARIO_FRAGMENT,
			scenarioFragmentRef,
		);
		const projectInScenario = useFragment<projectCard_ProjectFragment$key>(
			PROJECT_FRAGMENT,
			projectFragmentRef,
		);
		const useStageColorsForProjectNames = useUseStageColorsForProjectNames();
		const color = useStageColorsForProjectNames
			? `${projectInScenario.project.stage?.color ?? "#214ce2"} !important`
			: "black !important";
		const projectBudget = scenario.budget.projectBudgets.find(
			(p) => p.projectRef === projectInScenario.project.id,
		);

		const openAssignments = projectInScenario.assignments
			.edges!.map((e) => e!.node!)
			.filter((a) => !a.person).length;

		const dispatch = useDispatch();

		const [retrieve] = useMutation(PROJECT_RETRIEVE_GPS_MUTATION);

		const selectedProjectId = useSelector(selectSelectedProjectId);
		const isProjectSelected = selectedProjectId === projectInScenario.project.id;

		const isProjectsExpanded = useSelector(selectIsProjectsExpanded) || isProjectSelected;

		const targetId = useId().replace(":", "").replace(":", "");

		const handleGpsCoordinatesRetrieval = (projectId: string, cb?: () => void) => {
			retrieve({
				variables: {
					input: {
						projectId,
					},
				},
				onCompleted: () => {
					cb?.();
				},
			});
		};

		const handleTitleClick = () => {
			dispatch(
				setSelectedProjectId(isProjectSelected ? undefined : projectInScenario.project.id),
			);
			handleGpsCoordinatesRetrieval(projectInScenario.project.id);
		};

		const navigate = useNavigate();
		const hasPermissions = useSelector(selectHasPermissions);
		const hasMapsReadPermissions = hasPermissions(["UserInAccountPermission_Maps_Read"]);
		const hasEditScenarioPermission = hasPermissions(["UserInAccountPermission_Scenario_Edit"]);

		const isPast = useMemo(
			() => moment(projectInScenario.project.endDate).isSameOrBefore(moment.now()),
			[projectInScenario.project.endDate],
		);

		const contextMenuOptions: ContextMenuOption[] = [
			{
				kind: ContextMenuKind.override,
				node: (
					<RemoveProjectFromScenarioButton
						scenarioId={scenario.id}
						projectId={projectInScenario.project.id}
					/>
				),
			},
			{
				kind: ContextMenuKind.normal,
				onClick: () => {
					if (!hasMapsReadPermissions) return;
					const url = SCENARIO_MAP_VIEW_SCREEN_ROUTE.replace(
						":scenarioId",
						scenario.id,
					).replace(":projectId", projectInScenario.id);

					handleGpsCoordinatesRetrieval(projectInScenario.project.id, () => {
						navigate(url);
					});
				},
				icon: "pi pi-map",
			},
			{
				kind: ContextMenuKind.override,
				node: (
					<EditProjectInScenarioButton
						className="hide-print"
						scenarioId={scenario.id}
						hideLabel={true}
						projectFragmentRef={projectInScenario.project}
					/>
				),
			},
			{
				kind: ContextMenuKind.override,
				node: (
					<ProjectDetailsButton
						className="hide-print"
						projectFragmentRef={projectInScenario}
						scenarioId={scenario.id}
					/>
				),
			},
			{
				kind: ContextMenuKind.override,
				node: (
					<RemovePeopleFromAssignmentsButtonComponent
						projectId={projectInScenario.project.id}
						scenarioId={scenario.id}
					/>
				),
			},
			...(isUsingCUC
				? [
						{
							kind: ContextMenuKind.override,
							node: (
								<CheckScenarioPermissions
									requiredPermission={"UserInAccountPermission_Scenario_Edit"}
									scenarioFragmentRef={scenario}
								>
									<SyncAssignmentsCucButton
										projectInScenarioFragmentRef={projectInScenario}
									/>
								</CheckScenarioPermissions>
							),
						} as ContextMenuOptionOverride,
				  ]
				: []),
		];
		return (
			<>
				<ProjectCardBase
					style={{ ...style, pageBreakInside: "avoid" }}
					key={projectInScenario.id}
					className={classNames(
						{
							selected: isProjectSelected,
						},
						"to-inline-block-print",
					)}
				>
					<HeaderWrapper>
						<Tooltip content={projectInScenario.project.name} target={`#${targetId}`} />
						<Title
							id={targetId}
							className="m-0 cursor-pointer"
							color={color}
							onClick={() => {
								handleTitleClick();
							}}
						>
							{truncateString(projectInScenario.project.name, 30)}
						</Title>

						<ButtonsWrapper>
							<ContextMenu options={contextMenuOptions} />
						</ButtonsWrapper>
					</HeaderWrapper>
					{projectInScenario.project.projectIdentifier ? (
						<ProjectInfo>
							<IconWrapper>
								<i className="pi pi-id-card" />
							</IconWrapper>
							<ValueWrapper>
								{projectInScenario.project.projectIdentifier}
							</ValueWrapper>
						</ProjectInfo>
					) : null}

					<Conditional.Root
						condition={
							projectInScenario.project.startDate || projectInScenario.project.endDate
						}
					>
						<Conditional.Success>
							<ProjectInfo>
								<IconWrapper>
									<i
										className="pi pi-calendar"
										style={{
											color: isPast ? "darkred" : "unset",
										}}
									/>
								</IconWrapper>
								<ValueWrapper>
									<ProjectDateTimeDisplay
										projectFragmentRef={projectInScenario.project}
									/>
								</ValueWrapper>
							</ProjectInfo>
						</Conditional.Success>
					</Conditional.Root>

					<Conditional.Root condition={!!projectInScenario.project.address}>
						<Conditional.Success>
							<ProjectInfo>
								<IconWrapper>
									<i className="pi pi-map-marker" />
								</IconWrapper>
								<ValueWrapper>
									<AddressDisplay value={projectInScenario.project.address} />
								</ValueWrapper>
							</ProjectInfo>
						</Conditional.Success>
					</Conditional.Root>

					{shouldShowBudgeted &&
						projectBudget &&
						projectBudget.maximumBudget > 0 &&
						projectBudget.budgetedCost > 0 && (
							<ProjectInfo className="mb-1">
								<IconWrapper>
									<i className="pi pi-dollar" />
								</IconWrapper>
								<ValueWrapper
									className={
										projectBudget.budgetedCost <= projectBudget.maximumBudget
											? "text-green-500"
											: "text-orange-500"
									}
								>
									<span className="mr-2">Budgeted:</span>
									<CurrencyDisplay value={projectBudget.budgetedCost} /> /{" "}
									<CurrencyDisplay value={projectBudget.maximumBudget} />
								</ValueWrapper>
							</ProjectInfo>
						)}
					{shouldShowUtilized &&
						projectBudget &&
						projectBudget.maximumBudget > 0 &&
						projectBudget.utilizedCost > 0 && (
							<ProjectInfo>
								<IconWrapper>
									<i className="pi pi-dollar opacity-0" />
								</IconWrapper>
								<ValueWrapper
									className={
										projectBudget.utilizedCost <= projectBudget.maximumBudget
											? "text-green-500"
											: "text-orange-500"
									}
								>
									<span className="mr-2">Utilized:</span>
									<CurrencyDisplay value={projectBudget.utilizedCost} /> /{" "}
									<CurrencyDisplay value={projectBudget.maximumBudget} />
								</ValueWrapper>
							</ProjectInfo>
						)}

					{isProjectsExpanded && (
						<AssignmentsInProject
							scenarioFragmentRef={scenario}
							projectFragmentRef={projectInScenario}
						/>
					)}

					{openAssignments > 0 && (
						<OpenAssignmentsTag>
							{openAssignments} unfulfilled assignment{openAssignments > 1 && "s"}
						</OpenAssignmentsTag>
					)}
				</ProjectCardBase>
			</>
		);
	},
);

export const ProjectCardBase = styled(TkCard)`
	position: relative;
	width: 300px;
	margin-right: 1rem;
	margin-bottom: 1rem;
	box-shadow: none;
	height: max-content;

	.p-card-content {
		padding: 0;
	}

	&.selected {
		border: 1px solid green;
	}

	h2 {
		color: #214ce2;
		font-size: 1rem;
		font-weight: 600;
	}
`;

const OpenAssignmentsTag = styled.div`
	position: absolute;
	top: -8px;
	right: -8px;
	border: 1px solid #272d44;
	display: flex;
	padding: 4px 10px;
	background: #fff;
	align-items: center;
	border-radius: 2px;
	font-size: 0.7rem;

	@media print {
		top: 0;
		right: 0;
	}
`;

const ProjectInfo = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 0.5rem;
`;

const IconWrapper = styled.div`
	margin-right: 10px;
`;
const ValueWrapper = styled.div`
	display: flex;
	align-items: center;
	font-size: 0.8rem;
`;

const ButtonsWrapper = styled.div`
	flex-shrink: 0;
`;
const HeaderWrapper = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 0.5rem;
	justify-content: space-between;
	flex-wrap: nowrap;
`;
const Title = styled.h2<{ color: string }>`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: ${({ color }) => color};
`;
