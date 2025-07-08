import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_FRAGMENT = graphql`
	fragment assignmentsInProjectList_ProjectFragment on Project {
		id
	}
`;

export const SCENARIO_FRAGMENT = graphql`
	fragment assignmentsInProjectList_ScenarioFragment on Scenario {
		id
		...AssignmentCard_ScenarioFragment
	}
`;
