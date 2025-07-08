import moment from "moment-timezone";
import React from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment } from "react-relay";
import { CheckScenarioPermissions } from "@components/relay/CheckScenarioPermissions";
import { CreateAssignmentButton } from "@components/relay/CreateAssignmentButton";
import { CreateAssignmentsFromTemplateButton } from "@components/relay/CreateAssignmentsFromTemplateButton";
import { AssignmentsInProjectList } from "@components/relay/project-card/parts/assignments-in-project-list/assignments-in-project-list.component";
import { convertToMomentDate } from "@components/ui/DateTimeDisplay";
import { selectShowPast } from "@redux/ProjectViewSlice";
import { type assignmentsInProject_AssignmentInlineFragment$key } from "@relay/assignmentsInProject_AssignmentInlineFragment.graphql";
import { type assignmentsInProject_ProjectFragment$key } from "@relay/assignmentsInProject_ProjectFragment.graphql";
import { type assignmentsInProject_ScenarioFragment$key } from "@relay/assignmentsInProject_ScenarioFragment.graphql";
import {
	ASSIGNMENT_INLINE_FRAGMENT,
	PROJECT_FRAGMENT,
	SCENARIO_FRAGMENT,
} from "./assignments-in-project.graphql";

interface OwnProps {
	scenarioFragmentRef: assignmentsInProject_ScenarioFragment$key;
	projectFragmentRef: assignmentsInProject_ProjectFragment$key;
}

export const AssignmentsInProject = React.memo(
	({ scenarioFragmentRef, projectFragmentRef }: OwnProps) => {
		const scenario = useFragment<assignmentsInProject_ScenarioFragment$key>(
			SCENARIO_FRAGMENT,
			scenarioFragmentRef,
		);
		const projectInScenario = useFragment<assignmentsInProject_ProjectFragment$key>(
			PROJECT_FRAGMENT,
			projectFragmentRef,
		);
		const showPast = useSelector(selectShowPast);

		const assignments =
			projectInScenario.assignments.edges?.map((e) => {
				return readInlineData<assignmentsInProject_AssignmentInlineFragment$key>(
					ASSIGNMENT_INLINE_FRAGMENT,
					e!.node!,
				);
			}) ?? [];

		const assignmentsToShow = assignments
			.filter((a) => {
				if (showPast) {
					return true;
				}
				return convertToMomentDate(a.endDate).isAfter(moment());
			})
			.sort((x, y) => {
				const minAssignmentX = x.validAssignmentRoles.map((r) => r.sortOrder).min();
				const minAssignmentY = y.validAssignmentRoles.map((r) => r.sortOrder).min();

				if (minAssignmentY && minAssignmentX) {
					return minAssignmentX > minAssignmentY ? 1 : -1;
				}
				return minAssignmentX ? 1 : -1;
			});

		return (
			<div>
				<AssignmentsInProjectList
					assignmentsData={assignmentsToShow}
					projectFragmentRef={projectInScenario.project}
					scenarioFragmentRef={scenario}
				/>

				<CheckScenarioPermissions
					scenarioFragmentRef={scenario}
					requiredPermission={"UserInAccountPermission_Scenario_Edit"}
				>
					<CreateAssignmentButton
						className="mb-2 hide-print"
						scenarioId={scenario.id}
						projectFragmentRef={projectInScenario.project}
						assingmentsConnectionId={projectInScenario.assignments.__id}
					/>

					<CreateAssignmentsFromTemplateButton
						className="hide-print"
						scenarioId={scenario.id}
						projectFragmentRef={projectInScenario.project}
					/>
				</CheckScenarioPermissions>
			</div>
		);
	},
);
