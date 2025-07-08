import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {
    DeleteProjectStagesButton_DeleteMutation
} from "../../__generated__/DeleteProjectStagesButton_DeleteMutation.graphql";
import {DeleteButton} from "../ui/DeleteButton";

const REMOVE_MUTATION = graphql`
    mutation DeleteProjectStagesButton_DeleteMutation($input: DeleteProjectStageInput!, $connections: [ID!]!) {
        Project {
            deleteProjectStage(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }

    }
`

interface OwmProps {
    connectionIds?: string[]
    regionIds: string[]
    className?: string
}


export const DeleteProjectStagesButton = ({regionIds, connectionIds, className}: OwmProps) => {
    const [remove, isRemoving] = useMutation<DeleteProjectStagesButton_DeleteMutation>(REMOVE_MUTATION)

    return <DeleteButton
        isDeleting={isRemoving}
        selectedIds={regionIds}
        className={className}
        singularName={"Project Stage"}
        pluralName={"Project Stages"}
        doDelete={ids => {
            remove({
                variables: {
                    input: {
                        ids: ids,
                    },
                    connections: connectionIds || []
                }
            })
        }}
    />
}
