import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment projectsGridPartContent_ScenarioFragment on Scenario
	@argumentDefinitions(
		projectFilters: { type: "ProjectWithAssignmentsFiltersInput" }
		personOnAssignmentFilters: { type: "PersonOnAssignmentFiltersInput" }
	) {
		id
		...projectsGridPartContent_ScenarioRefetchableFragment
			@arguments(
				projectFilters: $projectFilters
				personOnAssignmentFilters: $personOnAssignmentFilters
			)
		...addProjectToScenarioCard_ScenarioFragment
			@arguments(
				projectFilters: $projectFilters
				personOnAssignmentFilters: $personOnAssignmentFilters
			)
		...projectCard_ScenarioFragment
	}
`;

export const SCENARIO_REFETCHABLE_FRAGMENT = graphql`
	fragment projectsGridPartContent_ScenarioRefetchableFragment on Scenario
	@refetchable(queryName: "projectsGridPartContent_Refetch")
	@argumentDefinitions(
		projectFilters: { type: "ProjectWithAssignmentsFiltersInput" }
		personOnAssignmentFilters: { type: "PersonOnAssignmentFiltersInput" }
	) {
		projects(
			projectWithAssignmentsFilters: $projectFilters
			peopleOnAssignmentFilters: $personOnAssignmentFilters
		) {
			edges {
				node {
					id
					...projectsGridPartContent_ProjectInScenarioInlineFragment
				}
			}
		}
	}
`;

export const PROJECT_IN_SCENARIO_INLINE_FRAGMENT = graphql`
	fragment projectsGridPartContent_ProjectInScenarioInlineFragment on ProjectInScenario @inline {
		id
		project {
			name
			startDate
			endDate
			stage {
				id
				name
			}

			division {
				id
			}
			region {
				id
			}
		}
		...projectCard_ProjectFragment
	}
`;
