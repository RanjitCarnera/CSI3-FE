import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment projectViewFiltersPart_ScenarioFragment on Scenario {
		id
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment projectViewFiltersPart_QueryFragment on Query {
		Division {
			Divisions {
				edges {
					node {
						id
						name
					}
				}
			}
		}
		Region {
			Regions {
				edges {
					node {
						id
						name
					}
				}
			}
		}
		Project {
			ProjectStages(first: 100) {
				edges {
					node {
						id
						name
					}
				}
			}
		}
	}
`;
