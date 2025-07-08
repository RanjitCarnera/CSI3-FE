import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query availabilityForecastScreen_Query($id: ID!) {
		node(id: $id) {
			... on Scenario {
				...availabilityForecastScreen_ScenarioFragment
			}
		}
		...baseScreen_QueryFragment
	}
`;

export const SCENARIO_QUERY = graphql`
	fragment availabilityForecastScreen_ScenarioFragment on Scenario {
		id
		...DashboardHeader_ScenarioFragment
	}
`;
