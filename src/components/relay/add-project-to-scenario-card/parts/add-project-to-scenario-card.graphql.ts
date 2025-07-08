import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment addProjectToScenarioCard_ScenarioFragment on Scenario
	@argumentDefinitions(
		projectFilters: { type: "ProjectWithAssignmentsFiltersInput" }
		personOnAssignmentFilters: { type: "PersonOnAssignmentFiltersInput" }
	) {
		...addProjectToScenarioModal_ScenarioFragment
			@arguments(
				projectFilters: $projectFilters
				personOnAssignmentFilters: $personOnAssignmentFilters
			)
		isMasterPlan
	}
`;
