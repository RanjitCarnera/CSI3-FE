import { graphql } from "babel-plugin-relay/macro";

export const REMOVE_PROJECT_FROM_SCENARIO_MUTATION = graphql`
	mutation removeProjectFromScenarioButton_RemoveProjectFromScenarioMutation(
		$input: RemoveProjectFromScenarioInput!
		$projectFilters: ProjectWithAssignmentsFiltersInput!
		$personOnAssignmentFilters: PersonOnAssignmentFiltersInput!
	) {
		Scenario {
			removeProjectFromScenario(input: $input) {
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
