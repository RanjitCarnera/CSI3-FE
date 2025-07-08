import { graphql } from "babel-plugin-relay/macro";

export const FRAGMENT = graphql`
	fragment projectDetailsButton_ProjectInScenario on ProjectInScenario {
		project {
			id
			name
		}
	}
`;
