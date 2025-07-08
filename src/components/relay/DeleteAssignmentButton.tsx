import { graphql } from "babel-plugin-relay/macro";
import { TkButtonLink } from "../ui/TkButtonLink";
import { useFragment, useMutation } from "react-relay";
import { DeleteAssignmentButton_AssignmentFragment$key } from "../../__generated__/DeleteAssignmentButton_AssignmentFragment.graphql";
import { useDialogLogic } from "../ui/useDialogLogic";
import { DeleteAssignmentButton_DeleteMutation } from "../../__generated__/DeleteAssignmentButton_DeleteMutation.graphql";

const REMOVE_MUTATION = graphql`
	mutation DeleteAssignmentButton_DeleteMutation($input: DeleteAssignmentInput!) {
		Scenario {
			deleteAssignment(input: $input) {
				update {
					project {
						id
						...projectCard_ProjectFragment
					}
				}
			}
		}
	}
`;

const ASSIGNMENT_FRAGMENT = graphql`
	fragment DeleteAssignmentButton_AssignmentFragment on Assignment {
		id
		validAssignmentRoles {
			name
		}
	}
`;

interface OwmProps {
	className?: string;
	assignmentFragmentRef: DeleteAssignmentButton_AssignmentFragment$key;
}

export const DeleteAssignmentButton = ({ className, assignmentFragmentRef }: OwmProps) => {
	const assignment = useFragment<DeleteAssignmentButton_AssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		assignmentFragmentRef,
	);
	const [remove, isRemoving] =
		useMutation<DeleteAssignmentButton_DeleteMutation>(REMOVE_MUTATION);

	const { dialogComponent, showDialog } = useDialogLogic();

	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-trash"
				iconPos="left"
				label="Delete"
				disabled={isRemoving}
				onClick={() => {
					showDialog({
						title: `Delete assignment for ${assignment.validAssignmentRoles
							.map((r) => r.name)
							.join(", ")}`,
						content:
							"Do you really want to delete this assignment from this project? This cannot be undone.",
						affirmativeText: "Delete",
						negativeText: "Cancel",
						dialogCallback: (result) => {
							if (result === "Accept") {
								remove({
									variables: {
										input: {
											assignmentId: assignment.id,
										},
									},
								});
							}
						},
					});
				}}
			/>
			{dialogComponent}
		</>
	);
};
