import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment personDetailsControl_PersonFragment on Person
	@argumentDefinitions(scenarioId: { type: "ID!" }) {
		id
		name
		assignmentRole {
			name
		}
		phone
		email
		address {
			lineOne
			postalCode
			city
			country
			state
			latitude
			longitude
		}
		comment
		avatar {
			url
		}
		associatedWithRegions {
			id
			name
		}
		associatedWithDivisions {
			id
			name
		}
		superVisorsRef {
			id
			name
		}
		employeeId

		documents {
			id
			name
			fileType
			url
			thumbnail
		}
		...skillsDisplay_PersonFragment
		...UtilizationOverTimeGraph_PersonFragment @arguments(scenarioId: $scenarioId)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment personDetailsControl_AssignmentListFragment on Query
	@refetchable(queryName: "PersonDetailsControl_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 50 }
		after: { type: "String" }
		filterByPerson: { type: "ID" }
		filterByScenario: { type: "ID" }
	) {
		Assignments {
			Assignments(
				first: $first
				after: $after
				filterByPerson: $filterByPerson
				filterByScenario: $filterByScenario
			) @connection(key: "PersonDetailsControl_Assignments") {
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						time
						...AssignmentProjectCard_AssignmentFragment
					}
				}
			}
		}
	}
`;
