import { useMutation } from "react-relay";
import { DELETE_ASSIGNMENT_ROLE_MUTATION } from "@components/delete-assignment-roles-button/delete-assignment-roles-button.graphql";
import { type DeleteAssignmentRolesButtonProps } from "@components/delete-assignment-roles-button/delete-assignment-roles-button.types";
import { type deleteAssignmentRolesButton_DeleteAssignmentRoleMutation } from "@relay/deleteAssignmentRolesButton_DeleteAssignmentRoleMutation.graphql";
import { DeleteButton } from "../ui/DeleteButton";

export const DeleteAssignmentRolesButton = ({
	assignmentRoleIds,
	connectionIds,
}: DeleteAssignmentRolesButtonProps) => {
	const [remove, isRemoving] =
		useMutation<deleteAssignmentRolesButton_DeleteAssignmentRoleMutation>(
			DELETE_ASSIGNMENT_ROLE_MUTATION,
		);

	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={assignmentRoleIds}
			singularName={"assignment role"}
			pluralName={"assignment roles"}
			doDelete={(ids) => {
				remove({
					variables: {
						input: {
							ids,
						},
						connections: connectionIds || [],
					},
				});
			}}
		/>
	);
};
