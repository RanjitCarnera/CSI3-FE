import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment staffViewFiltersPart_ScenarioFragment on Scenario {
		id
		utilization {
			personUtilizations {
				status
			}
		}
	}
`;
export const QUERY_FRAGMENT = graphql`
	fragment staffViewFiltersPart_QueryFragment on Query {
		Assignments {
			AssignmentRoles {
				edges {
					node {
						id
						name
					}
				}
			}
		}
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
	}
`;
