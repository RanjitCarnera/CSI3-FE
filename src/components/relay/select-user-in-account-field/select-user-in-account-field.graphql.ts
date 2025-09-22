import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query selectUserInAccountField_PeopleQuery(
		$accountId: ID!
		$filterByName: String
		$alwaysIncludeIds: [ID!]
		$excludeIds: [ID!]
		$first: Int
	) {
		Assessment {
			PeopleInAccount(
				accountId: $accountId
				first: $first
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
				excludeIds: $excludeIds
				activationStatus: true
			) {
				edges {
					node {
						...selectUserInAccountField_PersonFragment
					}
				}
			}
		}
	}
`;

export const USER_FRAGMENT = graphql`
	fragment selectUserInAccountField_PersonFragment on Person @inline {
		id
		name
	}
`;
