import { graphql } from "babel-plugin-relay/macro";

export const SYNC_DYNAMICS_PROJECTS_MUTATION = graphql`
	mutation syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation(
		$input: SynchronizeProjectsFromDynamicsInput!
	) {
		Dynamics {
			synchronizeProjectsFromDynamics(input: $input) {
				edges {
					node {
						id
						...ProjectsTable_ProjectFragment
						...syncProjectFromDynamicsButton_SyncProjectFragment
					}
				}
			}
		}
	}
`;
