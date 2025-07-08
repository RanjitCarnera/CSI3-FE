import { useMutation } from "react-relay";
import { DeleteButton } from "@components/ui/DeleteButton";
import { type deleteTagButton_deleteTagMutation } from "@relay/deleteTagButton_deleteTagMutation.graphql";
import { DELETE_TAG_MUTATION } from "@screens/tags/parts/delete-tag-button/delete-tag-button.graphql";
import { type DeleteTagButtonProps } from "@screens/tags/parts/delete-tag-button/delete-tag-button.types";

export const DeleteTagButton = ({ tagIds, connectionIds }: DeleteTagButtonProps) => {
	const [remove, isRemoving] =
		useMutation<deleteTagButton_deleteTagMutation>(DELETE_TAG_MUTATION);

	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={tagIds}
			singularName={"tag"}
			pluralName={"tags"}
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
