import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment personDetailsButton_ScenarioFragment on Scenario {
		id
		gapDays {
			personGapDays {
				personRef
				gapDays
			}
		}
	}
`;

export const PERSON_FRAGMENT = graphql`
	fragment personDetailsButton_PersonFragment on Person {
		id
		name
		comment
		assignmentRole {
			name
		}
	}
`;
export const SCENARIO_UTILIZATION_FRAGMENT = graphql`
	fragment personDetailsButton_ScenarioUtilizationFragment on ScenarioUtilization {
		personUtilizations {
			personRef
			utilizationPercentage
		}
	}
`;
