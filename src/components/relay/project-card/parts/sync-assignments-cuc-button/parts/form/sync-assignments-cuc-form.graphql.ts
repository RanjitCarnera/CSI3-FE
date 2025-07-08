import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_IN_SCENARIO_FRAGMENT = graphql`
	fragment syncAssignmentsCucForm_ProjectInScenarioFragment on ProjectInScenario {
		...formField_ProjectInScenarioFragment
	}
`;
