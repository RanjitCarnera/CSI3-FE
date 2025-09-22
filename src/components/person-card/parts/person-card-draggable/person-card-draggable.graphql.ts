import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment personCardDraggable_ScenarioFragment on Scenario
	@argumentDefinitions(utilizationWindow: { type: "UtilizationWindowInput" }) {
		id
		utilizationWithStandAndEndDate(utilizationWindow: $utilizationWindow) {
			personUtilizations {
				personRef
				status
			}
			...personCard_ScenarioUtilizationFragment
		}
		...personCard_ScenarioFragment
	}
`;

export const PERSON_FRAGMENT = graphql`
	fragment personCardDraggable_PersonFragment on Person
	@argumentDefinitions(scenarioId: { type: "ID!" }) {
		id
		name
		assignmentRole {
			id
			name
		}
		...personCard_PersonFragment @arguments(scenarioId: $scenarioId)
	}
`;
