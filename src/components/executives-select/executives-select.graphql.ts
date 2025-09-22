import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment executivesSelect_PersonFragment on Person @inline {
		id
		name
	}
`;

export const EXECUTIVES_QUERY = graphql`
	query executivesSelect_Query($filterByName: String, $alwaysIncludeIds: [ID!], $scenarioId: ID) {
		Staff {
			Executives(
				first: 20
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
				scenarioId: $scenarioId
				activationStatus: true
			) {
				edges {
					node {
						...executivesSelect_PersonFragment
					}
				}
			}
		}
	}
`;
