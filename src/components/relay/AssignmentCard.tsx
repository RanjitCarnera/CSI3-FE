import { graphql } from "babel-plugin-relay/macro";
import { classNames } from "primereact/utils";
import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import styled from "styled-components";
import { type PersonDragItem } from "@components/person-card/parts/person-card-draggable/person-card-draggable.types";
import { PersonDetailsButton } from "@components/person-details-button";
import { PersonDetailsButtonVariant } from "@components/person-details-button/person-details-button.types";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import {
	selectSelectedProjectId,
	setProjectViewPeopleFilters,
	setSelectedProjectId,
} from "@redux/ProjectViewSlice";
import { type AssignmentCard_AssignmentFragment$key } from "@relay/AssignmentCard_AssignmentFragment.graphql";
import { type AssignmentCard_AssignMutation } from "@relay/AssignmentCard_AssignMutation.graphql";
import { type AssignmentCard_ScenarioFragment$key } from "@relay/AssignmentCard_ScenarioFragment.graphql";
import { CheckScenarioPermissions } from "./CheckScenarioPermissions";
import { DeleteAssignmentButton } from "./DeleteAssignmentButton";
import { EditAssignmentButton } from "./EditAssignmentButton";
import { EmptyAssignmentButton } from "./EmptyAssignmentButton";
import { CommentIcon } from "../ui/CommentIcon";
import { CurrencyDisplay } from "../ui/CurrencyDisplay";
import { DateDisplay } from "../ui/DateTimeDisplay";
import { IsExecutiveIcon } from "../ui/IsExecutiveIcon";
import { NoApplicableRolesIcon } from "../ui/NoApplicableRolesIcon";
import { TkCard } from "../ui/TkCard";

const SCENARIO_FRAGMENT = graphql`
	fragment AssignmentCard_ScenarioFragment on Scenario {
		...CheckScenarioPermissions_ScenarioFragment
		...personDetailsButton_ScenarioFragment
		budget {
			projectBudgets {
				projectRef
				utilizedCost
				maximumBudget
				budgetedCost
				assignmentBudgets {
					assignmentRef
					budgetedCost
					utilizedCost
					months
				}
			}
		}
		utilization {
			...personDetailsButton_ScenarioUtilizationFragment
		}
	}
`;

const ASSIGMENT_FRAGMENT = graphql`
	fragment AssignmentCard_AssignmentFragment on Assignment {
		id
		comment
		person {
			name
			assignmentRole {
				id
			}
			...personDetailsButton_PersonFragment
		}
		project {
			id
			...EditAssignmentButton_ProjectFragment
		}
		startDate
		endDate
		validAssignmentRoles {
			id
			name
		}
		isExecutive
		...EditAssignmentButton_AssignmentFragment
		...EmptyAssignmentButton_AssignmentFragment
		...DeleteAssignmentButton_AssignmentFragment
	}
`;

const ASSIGN_MUTATION = graphql`
	mutation AssignmentCard_AssignMutation($input: FillAssignmentInput!) {
		Scenario {
			fillAssignment(input: $input) {
				update {
					project {
						id
					}
				}
				assignment {
					person {
						id
					}
				}
			}
		}
	}
`;

export interface DropProps {
	canDrop: boolean;
	isOver: boolean;
}

interface OwnProps {
	scenarioFragmentRef: AssignmentCard_ScenarioFragment$key;
	assignmentFragmentRef: AssignmentCard_AssignmentFragment$key;
}

export const AssignmentCard = React.memo(
	({ scenarioFragmentRef, assignmentFragmentRef }: OwnProps) => {
		const cu = useSelector(selectCurrentUser);
		const shouldShowBudgeted = ["BudgetedOnly", "BudgetedAndUtilized"].includes(
			cu?.user.extension.budgetDisplay ?? "None",
		);
		const shouldShowUtilized = ["UtilizedOnly", "BudgetedAndUtilized"].includes(
			cu?.user.extension.budgetDisplay ?? "None",
		);
		const scenario = useFragment<AssignmentCard_ScenarioFragment$key>(
			SCENARIO_FRAGMENT,
			scenarioFragmentRef,
		);
		const assignment = useFragment<AssignmentCard_AssignmentFragment$key>(
			ASSIGMENT_FRAGMENT,
			assignmentFragmentRef,
		);
		const [assign] = useMutation<AssignmentCard_AssignMutation>(ASSIGN_MUTATION);

		const assignmentBudget = scenario.budget.projectBudgets
			.find((pb) => pb.projectRef === assignment.project?.id)
			?.assignmentBudgets.find((ab) => ab.assignmentRef === assignment.id);

		const [{ canDrop, isOver }, drop] = useDrop<PersonDragItem, {}, DropProps>(() => ({
			// The type (or types) to accept - strings or symbols
			accept: "Person",
			// Props to collect
			collect: (monitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
			drop: (item) => {
				assign({
					variables: {
						input: {
							assignmentId: assignment.id,
							personId: item.id,
						},
					},
				});
				return {};
			},
		}));

		const isFilled = !!assignment.person?.name;
		const validDrag = isOver && canDrop && !isFilled;

		const personHasNoApplicableRoles =
			assignment.person &&
			!assignment.validAssignmentRoles
				.map((r) => r.id)
				.includes(assignment.person?.assignmentRole?.id ?? "");

		const matchingRole = assignment.validAssignmentRoles.find(
			(r) => assignment.person?.assignmentRole?.id === r.id,
		);
		const roleToShow = matchingRole ?? assignment.validAssignmentRoles[0];

		return (
			<AssignmentCardBase
				key={assignment.id}
				ref={drop as any}
				role={"Dustbin"}
				className={classNames("relative", {
					filled: isFilled,
					unfilled: !isFilled,
					"valid-drag": validDrag,
				})}
			>
				<div className="person flex mb-2">
					{assignment.isExecutive && <IsExecutiveIcon className="mr-2" />}
					{assignment.person ? (
						<PersonDetailsButton
							hideTooltip={true}
							scenarioFragmentRef={scenario}
							afterNameSlot={
								assignment.comment ? (
									<CommentIcon className="ml-2" comment={assignment.comment} />
								) : null
							}
							personFragmentRef={assignment.person}
							variant={PersonDetailsButtonVariant.assignmentCard}
							scenarioUtilizationRef={scenario.utilization}
						/>
					) : (
						<div
							style={{
								verticalAlign: "middle",
								display: "flex",
								justifyContent: "space-between",
								flex: 1,
								justifyItems: "center",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								Unassigned
							</div>
							{assignment.comment ? (
								<CommentIcon className="ml-2" comment={assignment.comment} />
							) : null}
						</div>
					)}
				</div>
				<div className="flex flex-row">
					<div className="flex mr-2">
						<div className="roles">
							{roleToShow && (
								<div
									className={classNames("role text-wrap", {
										applicable: matchingRole,
									})}
								>
									{roleToShow.name}{" "}
									{assignment.validAssignmentRoles.length > 1 &&
										!matchingRole && (
											<>
												<br />
												(+{assignment.validAssignmentRoles.length - 1} other
												roles)
											</>
										)}
								</div>
							)}
						</div>

						{personHasNoApplicableRoles && <NoApplicableRolesIcon className="ml-2" />}
					</div>

					<div className="dates ml-auto" style={{ minWidth: 105 }}>
						<DateDisplay short={true} value={assignment.startDate} /> -{" "}
						<DateDisplay short={true} value={assignment.endDate} />
					</div>
				</div>
				{assignmentBudget && shouldShowBudgeted && assignmentBudget.budgetedCost > 0 && (
					<div className="flex align-items-center text-xs">
						{!assignment.person && "Est. "}Budgeted:{" "}
						<CurrencyDisplay value={assignmentBudget.budgetedCost} /> (
						{assignmentBudget.months.toFixed(2)} months)
					</div>
				)}
				{assignmentBudget &&
					shouldShowUtilized &&
					assignment.person &&
					assignmentBudget.utilizedCost > 0 && (
						<div className="flex align-items-center text-xs">
							{!assignment.person && "Est. "}Utilized:{" "}
							<CurrencyDisplay value={assignmentBudget.utilizedCost} /> (
							{assignmentBudget.months.toFixed(2)} months)
						</div>
					)}
				<CheckScenarioPermissions
					scenarioFragmentRef={scenario}
					requiredPermission={"UserInAccountPermission_Scenario_Edit"}
				>
					<div className="controls">
						<EditAssignmentButton
							projectFragmentRef={assignment.project}
							className="mr-auto"
							assignmentFragmentRef={assignment}
						/>

						{isFilled ? (
							<EmptyAssignmentButton assignmentFragmentRef={assignment} />
						) : (
							<RecommendButton
								projectId={assignment.project.id}
								assignmentRoles={assignment.validAssignmentRoles.map((e) => e.id)}
								startDate={assignment.startDate}
								endDate={assignment.endDate}
							/>
						)}
						<DeleteAssignmentButton
							className="ml-auto"
							assignmentFragmentRef={assignment}
						/>
					</div>
				</CheckScenarioPermissions>
			</AssignmentCardBase>
		);
	},
);

const RecommendButton = ({
	assignmentRoles,
	projectId,
	startDate,
	endDate,
}: {
	projectId?: string;
	assignmentRoles?: string[];
	startDate?: string;
	endDate?: string;
}) => {
	const dispatch = useDispatch();
	const selectedProjectId = useSelector(selectSelectedProjectId);

	return (
		<TkButtonLink
			label="Recommend"
			onClick={() => {
				dispatch(
					setProjectViewPeopleFilters({
						filterByUtilizationStatus: ["NotAllocated", "Underallocated"],
						filterByAssignmentRoles: assignmentRoles ?? [],
						startDate,
						endDate,
					}),
				);
				if (!projectId) return;
				if (selectedProjectId === projectId) return;
				dispatch(setSelectedProjectId(projectId));
			}}
		/>
	);
};

export const AssignmentCardBase = styled(TkCard)`
	margin: 12px 5px;
	padding: 10px;
	position: relative;
	background: #fff;
	box-shadow: 0 0 4px rgb(121 149 165 / 30%);
	border-radius: 8px;

	.controls {
		display: none;
		position: absolute;
		bottom: -35px;
		padding-top: 10px;
		left: 0;
		width: 100%;
		background: white;
		box-shadow: 0 4px 4px rgb(121 149 165 / 30%);
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		z-index: 9;
	}

	&:hover {
		overflow: visible;

		.controls {
			display: flex;
		}
	}

	.person {
		color: var(--text);
		font-size: 0.9rem;
	}

	&.filled .person {
		font-weight: bold;
	}

	.roles,
	.dates {
		font-size: 0.8rem;
	}

	.role.applicable {
		font-weight: bold;
	}

	.dates {
		font-weight: bold;
	}

	&.unfilled {
		border: 1px solid #ff1500;
	}

	.p-card-content,
	.p-card-body {
		padding: 0;
	}

	&.valid-drag {
		background-color: var(--success);
		border: 0;
		box-shadow: none;
	}
`;
