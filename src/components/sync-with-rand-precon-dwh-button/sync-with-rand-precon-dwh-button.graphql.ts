import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment syncWithRandPreconDwhButton_ScenarioFragment on Scenario {
		id
		isMasterPlan
	}
`;
export const SYNC_WITH_RAND_PRECON_DWH_MUTATION = graphql`
	mutation syncWithRandPreconDwhButton_SyncWithRandPreconDwhMutation(
		$input: SyncRandPreconAccountWithRandDwhInput!
	) {
		Rand {
			syncRandPreconAccountWithRandDwh(input: $input) {
				projectStageEdges {
					node {
						id
						#						project view only
						...projectStagesTab_ProjectStageFragment
					}
				}
				regionEdges {
					node {
						id
						#						project view only
						...rosterListActiveFilters_RegionFragment
					}
				}
				projectEdges {
					node {
						id
						#						project view only
						...editProjectButton_ProjectFragment
					}
				}
				personEdges {
					node {
						id
						#						project only?
						...personDetailsButton_PersonFragment
					}
				}
				assignmentEdges {
					node {
						id
						#						project view only
						...AssignmentCard_AssignmentFragment
					}
				}
			}
		}
	}
`;
