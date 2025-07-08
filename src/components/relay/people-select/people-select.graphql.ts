import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment peopleSelect_PersonFragment on Person @inline {
		id
		name
	}
`;

export const PEOPLE_QUERY = graphql`
	query peopleSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
		Staff {
			People(
				first: 20
				excludeIds: $excludeIds
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...peopleSelect_PersonFragment
					}
				}
			}
		}
	}
`;
