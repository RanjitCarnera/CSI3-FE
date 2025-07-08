import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_FROM_RAND_MUTATION = graphql`
	mutation importFromRandButton_ImportFromRandMutation(
		$input: ImportProjectFromRandInput!
		$connectionIds: [ID!]!
	) {
		Rand {
			importProjectFromRand(input: $input) {
				edge @appendEdge(connections: $connectionIds) {
					node {
						...ProjectsTable_ProjectFragment
					}
				}
			}
		}
	}
`;
