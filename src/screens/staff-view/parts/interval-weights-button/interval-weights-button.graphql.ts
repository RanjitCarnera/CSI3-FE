import { graphql } from "babel-plugin-relay/macro";

export const SET_ASSIGNMENT_WEIGHTS_FOR_INTERVAL_MUTATION = graphql`
	mutation intervalWeightsButton_SetAssignmentWeightsForIntervalMutation(
		$input: SetAssignmentWeightsForIntervalInput!
	) {
		Assignment {
			setAssignmentWeightsForInterval(input: $input) {
				assignments {
					...EditAssignmentButton_AssignmentFragment
				}
			}
		}
	}
`;
