import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessments_Query {
		Viewer {
			Auth {
				currentAccount {
					id
				}
			}
		}
	}
`;
