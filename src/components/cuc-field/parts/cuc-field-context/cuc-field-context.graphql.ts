import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_FRAGMENT = graphql`
	fragment cucFieldContext_ProjectFragment on Project {
		id
		milestones {
			id
			data {
				date
				name
			}
		}
	}
`;
export const ASSIGNMENT_FRAGMENT = graphql`
	fragment cucFieldContext_AssignmentFragment on Assignment {
		id
	}
`;

export const GET_PERCENTAGE_FOR_DATE_ON_PROJECT_MUTATION = graphql`
	mutation cucFieldContext_GetPercentageForDateOnProjectMutation(
		$input: GetPercentageForDateOnProjectInput!
	) {
		Cuc {
			getPercentageForDateOnProject(input: $input) {
				responses {
					percentage
					isGood
				}
			}
		}
	}
`;
