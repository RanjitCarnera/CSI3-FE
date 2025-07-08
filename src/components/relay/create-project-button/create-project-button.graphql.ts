import { graphql } from "babel-plugin-relay/macro";

export const CREATE_PROJECT_MUTATION = graphql`
	mutation createProjectButton_CreateProjectMutation(
		$input: CreateProjectInput!
		$connectionId: ID!
	) {
		Project {
			createProject(input: $input) {
				edge @appendEdge(connections: [$connectionId]) {
					node {
						id
						...editProjectButton_ProjectFragment
					}
				}
			}
		}
	}
`;
