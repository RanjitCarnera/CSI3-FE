import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment assignmentsInProject_ScenarioFragment on Scenario {
		id
		...AssignmentCard_ScenarioFragment
		...CheckScenarioPermissions_ScenarioFragment
		...assignmentsInProjectList_ScenarioFragment
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment assignmentsInProject_ProjectFragment on ProjectInScenario {
		id

		project {
			id
			...assignmentsInProjectList_ProjectFragment
			...CreateAssignmentButton_ProjectFragment
			...CreateAssignmentsFromTemplateButton_ProjectFragment
		}
		assignments(first: 1000) @connection(key: "assignmentsInProject_assignments") {
			__id
			edges {
				node {
					...assignmentsInProject_AssignmentInlineFragment
				}
			}
		}
	}
`;

export const ASSIGNMENT_INLINE_FRAGMENT = graphql`
	fragment assignmentsInProject_AssignmentInlineFragment on Assignment @inline {
		id
		startDate
		endDate
		validAssignmentRoles {
			sortOrder
		}
		...AssignmentCard_AssignmentFragment
		tags {
			id
			data {
				color
				sortOrder
				name
			}
		}
	}
`;
