import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment editProjectStageModal_ProjectStageFragment on ProjectStage {
		id
		name
		reverseProjectOrderInReports
		sortOrder
		color
	}
`;

export const CREATE_MUTATION = graphql`
	mutation editProjectStageModal_CreateMutation(
		$input: CreateProjectStageInput!
		$connections: [ID!]!
	) {
		Project {
			createProjectStage(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...editProjectStageButton_ProjectStageFragment
					}
				}
			}
		}
	}
`;

export const EDIT_MUTATION = graphql`
	mutation editProjectStageModal_EditMutation($input: EditProjectStageInput!) {
		Project {
			editProjectStage(input: $input) {
				edge {
					node {
						id
						...editProjectStageButton_ProjectStageFragment
					}
				}
			}
		}
	}
`;
