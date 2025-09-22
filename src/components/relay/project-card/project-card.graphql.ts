import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment projectCard_ScenarioFragment on Scenario {
		id
		budget {
			projectBudgets {
				projectRef
				maximumBudget
				budgetedCost
				utilizedCost
			}
		}
		...assignmentsInProject_ScenarioFragment
		...CheckScenarioPermissions_ScenarioFragment
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment projectCard_ProjectFragment on ProjectInScenario {
		id
		project {
			id
			projectIdentifier
			name
			startDate
			endDate
			address {
				lineOne
				city
				country
				postalCode
				state
				latitude
				longitude
			}
			stage {
				color
			}
			...editProjectButton_ProjectFragment
			...editProjectInScenarioButton_ProjectFragment
			...ProjectDateTimeDisplay_ProjectFragment
		}
		assignments(first: 1000) @connection(key: "projectCard_assignments") {
			edges {
				node {
					person {
						id
					}
				}
			}
		}
		...assignmentsInProject_ProjectFragment
		...projectDetailsButton_ProjectInScenario
		...syncAssignmentsCucButton_ProjectInScenarioFragment
	}
`;

export const PROJECT_RETRIEVE_GPS_MUTATION = graphql`
	mutation projectCardgpsAddressesRetrieval_Mutation(
		$input: RetrieveProjectAndPeopleGpsCoordinatesInput!
	) {
		Project {
			retrieveProjectAndPeopleGpsCoordinates(input: $input) {
				clientMutationId
			}
		}
	}
`;
