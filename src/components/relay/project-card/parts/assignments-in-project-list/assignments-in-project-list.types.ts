import { type assignmentsInProject_AssignmentInlineFragment$data } from "@relay/assignmentsInProject_AssignmentInlineFragment.graphql";
import { type assignmentsInProjectList_ProjectFragment$key } from "@relay/assignmentsInProjectList_ProjectFragment.graphql";
import { type assignmentsInProjectList_ScenarioFragment$key } from "@relay/assignmentsInProjectList_ScenarioFragment.graphql";

export interface AssignmentsInProjectListProps {
	assignmentsData: assignmentsInProject_AssignmentInlineFragment$data[];
	projectFragmentRef: assignmentsInProjectList_ProjectFragment$key;
	scenarioFragmentRef: assignmentsInProjectList_ScenarioFragment$key;
}

export interface Tag {
	id: string;
	data: {
		name: string;
		sortOrder: number;
		color: string;
	};
}
