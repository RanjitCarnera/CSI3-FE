import { Dialog } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment } from "react-relay";
import styled from "styled-components";
import tw from "twin.macro";
import {
	selectScenarioProjectFilters,
	setProjectViewProjectFilters,
	setSelectedProjectId,
} from "@redux/ProjectViewSlice";
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
	const weightPercentage = Math.round((assignment.weight ?? 1) * 100);
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
				<div className={"roles"}>Weight: {weightPercentage}%</div>
			</AssignmentProjectCardBase>
			<Dialog
				// @ts-expect-error
				title={
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
			</Dialog>
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
