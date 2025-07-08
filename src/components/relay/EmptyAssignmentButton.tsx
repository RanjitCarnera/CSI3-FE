import { graphql } from "babel-plugin-relay/macro";
import { useFragment, useMutation } from "react-relay";
import { type EmptyAssignmentButton_AssignmentFragment$key } from "../../__generated__/EmptyAssignmentButton_AssignmentFragment.graphql";
import { type EmptyAssignmentButton_EmptyMutation } from "../../__generated__/EmptyAssignmentButton_EmptyMutation.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";

const EMPTY_MUTATION = graphql`
	mutation EmptyAssignmentButton_EmptyMutation($input: EmptyAssignmentInput!) {
		Scenario {
			emptyAssignment(input: $input) {
				assignment {
					person {
						id
					}
				}
			}
		}
	}
`;

const ASSIGNMENT_FRAGMENT = graphql`
	fragment EmptyAssignmentButton_AssignmentFragment on Assignment {
		id
		validAssignmentRoles {
			name
		}
	}
`;

interface OwmProps {
	className?: string;
	assignmentFragmentRef: EmptyAssignmentButton_AssignmentFragment$key;
}

export const EmptyAssignmentButton = ({ className, assignmentFragmentRef }: OwmProps) => {
	const assignment = useFragment<EmptyAssignmentButton_AssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		assignmentFragmentRef,
	);
	const [empty, isRemoving] = useMutation<EmptyAssignmentButton_EmptyMutation>(EMPTY_MUTATION);

	return (
		<TkButtonLink
			className={className}
			icon="pi pi-times"
			iconPos="left"
			label="Empty"
			disabled={isRemoving}
			onClick={() => {
				empty({
					variables: {
						input: {
							assignmentId: assignment.id,
						},
					},
				});
			}}
		/>
	);
};
