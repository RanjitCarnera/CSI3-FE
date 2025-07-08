import { graphql } from "babel-plugin-relay/macro";

export const ADD_EXISTING_PROJECTS_TO_SCENARIO_MUTATION = graphql`
	mutation addSelectedProjectsToScenarioButton_AddExistingProjectsToScenarioMutation(
		$input: AddExistingProjectsToScenarioInput!
	) {
		Scenario {
			addExistingProjectsToScenario(input: $input) {
				edge {
					node {
						id
						...ProjectsGridPart_ScenarioFragment
					}
				}
			}
		}
	}
`;
