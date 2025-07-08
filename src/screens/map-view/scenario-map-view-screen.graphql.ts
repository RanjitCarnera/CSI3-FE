import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query scenarioMapViewScreen_Query(
		$id: ID!
		$filterByName: String
		$filterByAssignmentRoles: [ID!]
		$filterByUtilizationStatus: [UtilizationStatus!]
		$filterBySalaryMinimum: BigDecimal
		$filterBySalaryMaximum: BigDecimal
		$filterByFreeDateMinimum: LocalDate
		$filterByFreeDateMaximum: LocalDate
		$filterByAllocatedDateMinimum: LocalDate
		$filterByAllocatedDateMaximum: LocalDate
		$filterByGapDaysMinimum: Int
		$filterByGapDaysMaximum: Int
		$filterByDistanceMinimum: Int
		$filterByDistanceMaximum: Int
		$sortByClosestToProject: ID
		$utilizationWindow: UtilizationWindowInput
		$filterByStaff: [ID!]
	) {
		node(id: $id) {
			... on Scenario {
				...scenarioMapViewScreen_ScenarioFragment
			}
		}
		...rosterPart_StaffFragment
			@arguments(
				filterByName: $filterByName
				scenarioRef: $id
				filterByAssignmentRoles: $filterByAssignmentRoles
				filterByUtilizationStatus: $filterByUtilizationStatus
				filterBySalaryMinimum: $filterBySalaryMinimum
				filterBySalaryMaximum: $filterBySalaryMaximum
				filterByFreeDateMinimum: $filterByFreeDateMinimum
				filterByFreeDateMaximum: $filterByFreeDateMaximum
				filterByAllocatedDateMinimum: $filterByAllocatedDateMinimum
				filterByAllocatedDateMaximum: $filterByAllocatedDateMaximum
				filterByGapDaysMinimum: $filterByGapDaysMinimum
				filterByGapDaysMaximum: $filterByGapDaysMaximum
				filterByDistanceMinimum: $filterByDistanceMinimum
				filterByDistanceMaximum: $filterByDistanceMaximum
				sortByClosestToProject: $sortByClosestToProject
				utilizationWindow: $utilizationWindow
				filterByStaff: $filterByStaff
			)
		...baseScreen_QueryFragment
		...rosterPart_FilterFragment
	}
`;
export const SCENARIO_QUERY = graphql`
	fragment scenarioMapViewScreen_ScenarioFragment on Scenario {
		id
		...ProjectMapPart_ScenarioFragment
		...rosterPart_ScenarioFragment
		...DashboardHeader_ScenarioFragment
		projects {
			edges {
				node {
					id
					project {
						id
					}
					...ProjectMapPart_ProjectInScenarioFragment
				}
			}
		}
	}
`;
