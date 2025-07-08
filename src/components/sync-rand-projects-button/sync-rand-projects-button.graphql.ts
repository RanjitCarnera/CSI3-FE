import { graphql } from "babel-plugin-relay/macro";

export const SYNC_RAND_PROJECTS_MUTATION = graphql`
	mutation syncRandProjectsButton_SyncProjectsFromRandMutation(
		$input: SynchronizeProjectsFromRandInput!
	) {
		Rand {
			synchronizeProjectsFromRand(input: $input) {
				syncResult {
					editedEntities
					issues {
						id
						issue
					}
				}
				edges {
					node {
						id
						...ProjectsTable_ProjectFragment
						...syncProjectFromRandButton_SyncProjectFragment
					}
				}
			}
		}
	}
`;
