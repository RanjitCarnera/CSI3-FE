import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_IN_SCENARIO_FRAGMENT = graphql`
	fragment formField_ProjectInScenarioFragment on ProjectInScenario {
		project {
			name
		}
		assignments(first: 1000) @connection(key: "formField_assignments") {
			edges {
				node {
					id
					person {
						name
					}
					validAssignmentRoles {
						name
						cucTemplate {
							id
						}
					}
					startDate
					endDate
					cuc {
						...EditAssignmentButton_CUCInlineFragment
					}
					weight
				}
			}
		}
	}
`;
