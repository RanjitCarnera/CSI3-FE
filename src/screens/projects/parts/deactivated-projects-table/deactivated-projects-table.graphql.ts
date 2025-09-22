import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query deactivatedProjectsTable_Query(
		$first: Int
		$filterByName: String
		$filterByRegions: [ID!]
		$filterByDivisions: [ID!]
		$filterByStages: [ID!]
		$activationStatus: Boolean
	) {
		...deactivatedProjectsTable_ProjectsListFragment
			@arguments(
				first: $first
				filterByName: $filterByName
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
				filterByStages: $filterByStages
				activationStatus: $activationStatus
			)
	}
`;
export const QUERY_FRAGMENT = graphql`
	fragment deactivatedProjectsTable_ProjectsListFragment on Query
	@refetchable(queryName: "deactivatedProjectsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 200 }
		after: { type: "String" }
		filterByName: { type: "String" }
		filterByRegions: { type: "[ID!]" }
		filterByDivisions: { type: "[ID!]" }
		filterByStages: { type: "[ID!]" }
		activationStatus: { type: "Boolean" }
	) {
		Project {
			Projects(
				first: $first
				after: $after
				filterByName: $filterByName
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
				filterByStages: $filterByStages
				activationStatus: $activationStatus
			) @connection(key: "deactivatedProjectsTable_Projects") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						...ProjectsTable_ProjectFragment
					}
				}
			}
		}
	}
`;
