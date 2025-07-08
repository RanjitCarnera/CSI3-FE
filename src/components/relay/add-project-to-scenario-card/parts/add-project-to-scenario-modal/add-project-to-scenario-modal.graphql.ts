import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment addProjectToScenarioModal_ScenarioFragment on Scenario
	@argumentDefinitions(
		projectFilters: { type: "ProjectWithAssignmentsFiltersInput" }
		personOnAssignmentFilters: { type: "PersonOnAssignmentFiltersInput" }
	) {
		id
		projects(
			projectWithAssignmentsFilters: $projectFilters
			peopleOnAssignmentFilters: $personOnAssignmentFilters
		) {
			edges {
				node {
					id
					project {
						name
						source
					}
				}
			}
		}
	}
`;

export const ADD_NEW_MUTATION = graphql`
	mutation addProjectToScenarioModal_AddNewMutation(
		$input: AddNewProjectToScenarioInput!
		$projectFilters: ProjectWithAssignmentsFiltersInput!
		$personOnAssignmentFilters: PersonOnAssignmentFiltersInput!
		$connectionIds: [ID!]!
	) {
		Scenario {
			addNewProjectToScenario(input: $input) {
				edge @appendEdge(connections: $connectionIds) {
					node {
						id
						...ProjectsGridPart_ScenarioFragment
							@arguments(
								projectFilters: $projectFilters
								personOnAssignmentFilters: $personOnAssignmentFilters
							)
					}
				}
			}
		}
	}
`;

export const ADD_EXISTING_MUTATION = graphql`
	mutation addProjectToScenarioModal_AddExistingMutation(
		$input: AddExistingProjectsToScenarioInput!
		$projectFilters: ProjectWithAssignmentsFiltersInput!
		$personOnAssignmentFilters: PersonOnAssignmentFiltersInput!
	) {
		Scenario {
			addExistingProjectsToScenario(input: $input) {
				edge {
					node {
						id
						...ProjectsGridPart_ScenarioFragment
							@arguments(
								projectFilters: $projectFilters
								personOnAssignmentFilters: $personOnAssignmentFilters
							)
					}
				}
			}
		}
	}
`;
