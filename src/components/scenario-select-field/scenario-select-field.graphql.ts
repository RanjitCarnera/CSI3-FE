import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query scenarioSelectField_Query(
		$last: Int
		$after: String
		$before: String
		$filterByName: String
		$onlyMaster: Boolean
		$onlyMine: Boolean
		$alwaysIncludeIds: [ID!]
		$excludeIds: [ID!]
	) {
		Scenario {
			Scenarios(
				first: 20
				last: $last
				after: $after
				before: $before
				alwaysIncludeIds: $alwaysIncludeIds
				excludeIds: $excludeIds
				filterByName: $filterByName
				onlyMaster: $onlyMaster
				onlyShowMine: $onlyMine
			) {
				pageInfo {
					startCursor
					endCursor
					hasNextPage
					hasPreviousPage
				}
				edges {
					cursor
					node {
						id
						...scenarioSelectField_ScenarioInlineFragment
					}
				}
			}
		}
	}
`;

export const SCENARIO_INLINE_FRAGMENT = graphql`
	fragment scenarioSelectField_ScenarioInlineFragment on Scenario @inline {
		id
		name
		isMasterPlan
		isPublic
	}
`;
