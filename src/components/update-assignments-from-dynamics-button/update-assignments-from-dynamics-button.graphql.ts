import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_ASSIGNMENTS_FROM_DYNAMICS_MUTATION = graphql`
	mutation updateAssignmentsFromDynamicsButton_ImportAssignmentsFromDynamicsMutation(
		$input: ImportAssignmentsFromDynamicsInput!
	) {
		DynamicsPreCon {
			importAssignmentsFromDynamics(input: $input) {
				clientMutationId
			}
		}
	}
`;
export const SCENARIO_FRAGMENT = graphql`
	fragment updateAssignmentsFromDynamicsButton_ScenarioFragment on Scenario {
		id
	}
`;
export const ACCOUNT_FRAGMENT = graphql`
	fragment updateAssignmentsFromDynamicsButton_AccountFragment on Account {
		id
	}
`;
