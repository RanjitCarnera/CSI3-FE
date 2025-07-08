import { graphql } from "babel-plugin-relay/macro";

export const NOT_YET_IMPORTED_PROJECTS_FROM_RAND_QUERY = graphql`
	query projectFromRandSelect_Query {
		Rand {
			NotYetImportedProjectsFromRand {
				id
				name
				projectIdentifier
			}
		}
	}
`;
