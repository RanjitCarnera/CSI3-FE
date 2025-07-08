import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment loadPursuitProjectsFromRandDwhButton_ScenarioFragment on Scenario {
		id
		isMasterPlan
	}
`;
export const LOAD_PURSUIT_PROJECTS_FROM_DWH_MUTATION = graphql`
	mutation loadPursuitProjectsFromRandDwhButton_loadPursuitProjectsFromDWHMutation(
		$input: LoadPursuitProjectsFromDWHInput!
	) {
		Rand {
			loadPursuitProjectsFromDWH(input: $input) {
				syncResult {
					editedEntities
					issues {
						id
						issue
					}
				}
				clientMutationId
			}
		}
	}
`;
