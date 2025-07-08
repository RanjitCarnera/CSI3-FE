import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { type DeletePeopleButton_DeleteMutation } from "../../__generated__/DeletePeopleButton_DeleteMutation.graphql";
import { DeleteButton } from "../ui/DeleteButton";

const REMOVE_MUTATION = graphql`
	mutation DeletePeopleButton_DeleteMutation($input: DeletePersonInput!, $connections: [ID!]!) {
		Staff {
			deletePerson(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;

interface OwmProps {
	connectionIds?: string[];
	peopleIds: string[];
	className?: string;
}

export const DeletePeopleButton = ({ peopleIds, connectionIds, className }: OwmProps) => {
	const [remove, isRemoving] = useMutation<DeletePeopleButton_DeleteMutation>(REMOVE_MUTATION);

	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={peopleIds}
			className={className}
			singularName={"Resource"}
			pluralName={"Resources"}
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
