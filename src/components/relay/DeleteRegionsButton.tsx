import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { type DeleteRegionsButton_DeleteMutation } from "../../__generated__/DeleteRegionsButton_DeleteMutation.graphql";
import { DeleteButton } from "../ui/DeleteButton";

const REMOVE_MUTATION = graphql`
	mutation DeleteRegionsButton_DeleteMutation($input: DeleteRegionInput!, $connections: [ID!]!) {
		Region {
			deleteRegion(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;

interface OwmProps {
	connectionIds?: string[];
	regionIds: string[];
}

export const DeleteRegionsButton = ({ regionIds, connectionIds }: OwmProps) => {
	const [remove, isRemoving] = useMutation<DeleteRegionsButton_DeleteMutation>(REMOVE_MUTATION);

	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={regionIds}
			singularName={"Region"}
			pluralName={"Regions"}
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
