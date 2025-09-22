import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import styled from "styled-components";
import tw from "twin.macro";
import { Conditional } from "@components/conditional";
import { EditAssignmentButton } from "@components/relay/EditAssignmentButton";
import { TkDialog } from "@components/ui/TkDialog";
import {
	selectScenarioProjectFilters,
	setProjectViewProjectFilters,
	setSelectedProjectId,
} from "@redux/ProjectViewSlice";
import { type AssignmentProjectCard_ChangeableWeightAssignmentFragment$key } from "@relay/AssignmentProjectCard_ChangeableWeightAssignmentFragment.graphql";
import { type AssignmentProjectCardMutation } from "@relay/AssignmentProjectCardMutation.graphql";
import { type AssignmentProjectCard_AssignmentFragment$key } from "../../__generated__/AssignmentProjectCard_AssignmentFragment.graphql";
import { DateDisplay } from "../ui/DateTimeDisplay";
import { TkCard } from "../ui/TkCard";

const ASSIGMENT_FRAGMENT = graphql`
	fragment AssignmentProjectCard_AssignmentFragment on Assignment {
		id
		weight
		project {
			name
			id
			isDeactivated
			...EditAssignmentButton_ProjectFragment
		}
		person {
			name
		}
		startDate
		endDate
		validAssignmentRoles {
			id
			name
		}
		weightToDay
		cuc {
			markers {
				kind
			}
		}
		...EditAssignmentButton_AssignmentFragment
		...AssignmentProjectCard_ChangeableWeightAssignmentFragment
	}
`;

interface OwnProps {
	className?: string;
	assignmentFragmentRef: AssignmentProjectCard_AssignmentFragment$key;
}

export const AssignmentProjectCard = ({ className, assignmentFragmentRef }: OwnProps) => {
	const [isVisible, setIsVisible] = React.useState(false);
	const handleToggleIsVisible = () => {
		setIsVisible((boo) => !boo);
	};
	const dispatch = useDispatch();
	const projectViewProjectFilters = useSelector(selectScenarioProjectFilters);
	const assignment = useFragment<AssignmentProjectCard_AssignmentFragment$key>(
		ASSIGMENT_FRAGMENT,
		assignmentFragmentRef,
	);

	const handleGoToProject = () => {
		if (assignment.project.isDeactivated) {
			handleToggleIsVisible();
			return;
		}
		dispatch(
			setProjectViewProjectFilters({
				...projectViewProjectFilters,
				filterByName: assignment.project?.name,
			}),
		);
		dispatch(setSelectedProjectId(assignment.project.id));
	};
	const weightToDayPercentage = Math.round((assignment.weightToDay ?? 1) * 100);
	const hasCuc = !!assignment.cuc?.markers;
	return (
		<>
			<AssignmentProjectCardBase className={className}>
				<div className="person mb-2 cursor-pointer" onClick={handleGoToProject}>
					{assignment.project?.name}
				</div>
				<div className="roles mb-2">
					{assignment.validAssignmentRoles.map((r) => (
						<div key={"role" + assignment.id + r.id} className="role">
							{r.name}
						</div>
					))}
				</div>
				<div className="dates ml-auto mb-2">
					<DateDisplay short={true} value={assignment.startDate} /> -{" "}
					<DateDisplay short={true} value={assignment.endDate} />
				</div>
				<Conditional.Root condition={!hasCuc}>
					<Conditional.Success>
						<ChangeableWeight assignmentFragmentRef={assignment} />
					</Conditional.Success>
					<Conditional.Fallback>
						<div
							style={{
								display: "flex",
								gap: "1rem",
								justifyContent: "space-between",
								alignItems: "baseline",
							}}
						>
							<div className={"roles"}>
								Weight:{" "}
								<span style={{ color: "lightgrey" }}>{weightToDayPercentage}%</span>
							</div>
							<EditAssignmentButton
								assignmentFragmentRef={assignment}
								projectFragmentRef={assignment.project}
							/>
						</div>
					</Conditional.Fallback>
				</Conditional.Root>
			</AssignmentProjectCardBase>
			<TkDialog
				dismissableMask={true}
				header={
					<div>
						<span>{assignment.project.name}</span>
						<SmallTitle>deactivated</SmallTitle>
					</div>
				}
				visible={isVisible}
				onHide={handleToggleIsVisible}
			>
				<p>
					Deactivated projects cannot be shown on the project view.
					<br /> To view it's information on the projectview, re-enable it under settings.
				</p>
			</TkDialog>
		</>
	);
};

export const AssignmentProjectCardBase = styled(TkCard)`
	margin: 12px 5px;
	padding: 10px;
	position: relative;
	background: #fff;
	box-shadow: 0 0 4px rgb(121 149 165 / 30%);
	border-radius: 8px;

	.person {
		color: var(--text);
		font-size: 1rem;
		font-weight: bold;
	}

	.roles,
	.dates {
		font-size: 0.8rem;
	}

	.p-card-content,
	.p-card-body {
		padding: 0;
	}
`;

const SmallTitle = tw.span`text-sm ml-3`;

const EDIT_ASSIGNMENT_WEIGHT_MUTATION = graphql`
	mutation AssignmentProjectCardMutation($input: EditAssignmentWeightInput!) {
		Scenario {
			editAssignmentWeight(input: $input) {
				assignment {
					...EditAssignmentButton_AssignmentFragment
					weight
				}
			}
		}
	}
`;

const ASSIGNMENT_FRAGMENT = graphql`
	fragment AssignmentProjectCard_ChangeableWeightAssignmentFragment on Assignment {
		id
		weight
	}
`;
const ChangeableWeight = ({
	assignmentFragmentRef,
}: {
	assignmentFragmentRef: AssignmentProjectCard_ChangeableWeightAssignmentFragment$key;
}) => {
	const assignment = useFragment<AssignmentProjectCard_ChangeableWeightAssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		assignmentFragmentRef,
	);

	const initialValue = Math.floor((assignment.weight ?? 1) * 100);
	const [value, setValue] = useState<string>(initialValue + "");
	const ref = useRef<HTMLTextAreaElement | null>(null);

	const [commit] = useMutation<AssignmentProjectCardMutation>(EDIT_ASSIGNMENT_WEIGHT_MUTATION);

	useEffect(() => {
		const listener = () => {
			handleCommit();
		};
		ref.current?.addEventListener("blur", listener);

		return () => {
			ref.current?.removeEventListener("blur", listener);
		};
	}, [value]);

	const handleCommit = useCallback(() => {
		const weightAsNumber = +value;
		if (weightAsNumber === undefined || weightAsNumber === null) return;

		const isNumber = !Number.isNaN(weightAsNumber);
		if (!isNumber) {
			toast.error("Could not save this weight");
			setValue(Math.floor((assignment.weight ?? 1) * 100) + "");
			return;
		}
		if (weightAsNumber === initialValue) {
			return;
		}
		commit({
			variables: {
				input: {
					assignmentId: assignment.id,
					weight: weightAsNumber / 100,
				},
			},
			onCompleted: () => {
				toast.success("Saved weight.");
			},
		});
	}, [value, assignment.id, assignment.weight]);
	return (
		<div className={"roles"} style={{ display: "flex", alignItems: "baseline" }}>
			<span>Weight: </span>
			<div style={{ width: "0.5rem" }}></div>
			<TextAreaSpan
				ref={ref}
				style={{ width: "1.5rem" }}
				value={value}
				onChange={(e) => {
					setValue(e.currentTarget.value);
				}}
				onKeyDown={(e) => {
					if (e.code === "Enter") {
						e.preventDefault();
						ref?.current?.blur();
					}
				}}
			/>
			<span>%</span>
		</div>
	);
};
const TextAreaSpan = styled.textarea`
	font-style: unset;
	font-variant-ligatures: unset;
	font-variant-caps: unset;
	font-variant-numeric: unset;
	font-variant-east-asian: unset;
	font-variant-alternates: unset;
	font-variant-position: unset;
	font-variant-emoji: unset;
	font-weight: normal;
	font-stretch: unset;
	font-size: 0.8rem;
	font-family: unset;
	font-optical-sizing: unset;
	font-size-adjust: unset;
	font-kerning: unset;
	font-feature-settings: unset;
	font-variation-settings: unset;
	text-rendering: auto;
	color: var(--text);
	letter-spacing: normal;
	word-spacing: normal;
	line-height: normal;
	text-transform: none;
	text-indent: 0;
	text-shadow: none;
	display: inline-block;
	text-align: end;
	appearance: auto;
	-webkit-rtl-ordering: logical;
	//resize: -internal-textarea-auto;
	cursor: text;
	overflow-wrap: break-word;
	background-color: field;
	column-count: initial !important;
	margin: 0;
	border: none;
	padding: 0;
	white-space: pre-wrap;
	height: 15px;
	resize: none;
`;
