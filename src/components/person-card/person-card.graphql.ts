import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment personCard_ScenarioFragment on Scenario {
		id
		...personDetailsButton_ScenarioFragment
	}
`;

export const PERSON_FRAGMENT = graphql`
	fragment personCard_PersonFragment on Person @argumentDefinitions(scenarioId: { type: "ID!" }) {
		id
		name
		assignmentRole {
			id
			name
		}
		sumOfProjectVolume(scenarioRef: $scenarioId)
		comment
		...personDetailsButton_PersonFragment
	}
`;

export const SCENARIO_UTILIZATION_FRAGMENT = graphql`
	fragment personCard_ScenarioUtilizationFragment on ScenarioUtilization {
		personUtilizations {
			personRef
			utilizationPercentage
			status
		}
		...personDetailsButton_ScenarioUtilizationFragment
	}
`;
