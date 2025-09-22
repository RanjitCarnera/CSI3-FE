import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_IN_SCENARIO_FRAGMENT = graphql`
	fragment syncAssignmentsCucButton_ProjectInScenarioFragment on ProjectInScenario {
		project {
			name
		}
		assignments(first: 1000) @connection(key: "syncAssignmentsCucButton_assignments") {
			edges {
				node {
					id
					person {
						name
					}
					validAssignmentRoles {
						id
						name
						sortOrder
						cucTemplate {
							id
						}
					}
					startDate
					endDate
				}
			}
		}
		...syncAssignmentsCucForm_ProjectInScenarioFragment
	}
`;

export const SYNC_ASSIGNMENTS_WITH_CUC_MUTATION = graphql`
	mutation syncAssignmentsCucButton_SyncAssignmentsWithCucMutation(
		$input: SyncAssignmentsWithCucInput!
	) {
		Assignment {
			syncAssignmentsWithCuc(input: $input) {
				changedAssignments {
					...assignmentsInProject_AssignmentInlineFragment
					...AssignmentCard_AssignmentFragment
					...EditAssignmentButton_AssignmentFragment
					...EmptyAssignmentButton_AssignmentFragment
					...AssignmentProjectCard_AssignmentFragment
					...DeleteAssignmentButton_AssignmentFragment
				}
			}
		}
	}
`;
