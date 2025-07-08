import { useMutation } from "react-relay";
import { DELETE_DIVISION_MUTATION } from "@components/delete-division-button/delete-division-button.graphql";
import { DeleteButton } from "@components/ui/DeleteButton";
import { type deleteDivisionButton_DeleteDivisionMutation } from "@relay/deleteDivisionButton_DeleteDivisionMutation.graphql";

export const DeleteDivisionButton = ({ divisionIds, connectionIds }: DeleteDivisionButton) => {
	const [remove, isRemoving] =
		useMutation<deleteDivisionButton_DeleteDivisionMutation>(DELETE_DIVISION_MUTATION);

	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={divisionIds}
			singularName={"Division"}
			pluralName={"Divisions"}
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
