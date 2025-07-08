import { graphql } from "babel-plugin-relay/macro";

export const APPROXIMATE_ASSIGNMENT_RESIZE_MUTATION = graphql`
	mutation allocationBarProvider_ApproximateAssignmentResizeMutation(
		$input: ApproximateAssignmentResizeInput!
	) {
		Staffview {
			approximateAssignmentResize(input: $input) {
				startDate
				endDate
			}
		}
	}
`;

export const APPROXIMATE_MOVE_ASSIGNMENT_MUTATION = graphql`
	mutation allocationBarProvider_ApproximateMoveAssignmentMutation(
		$input: ApproximateMoveAssignmentInput!
	) {
		Staffview {
			approximateMoveAssignment(input: $input) {
				startDate
				endDate
			}
		}
	}
`;
