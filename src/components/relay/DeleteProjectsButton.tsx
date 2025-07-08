import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {DeleteProjectsButton_DeleteMutation} from "../../__generated__/DeleteProjectsButton_DeleteMutation.graphql";
import {DeleteButton} from "../ui/DeleteButton";

const REMOVE_MUTATION = graphql`
    mutation DeleteProjectsButton_DeleteMutation($input: DeleteProjectInput!, $connections: [ID!]!) {
        Project {
            deleteProject(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }

    }
`

interface OwmProps {
    connectionIds?: string[]
    projectIds: string[]
    className?: string
}


export const DeleteProjectsButton = ({projectIds, connectionIds, className}: OwmProps) => {
    const [remove, isRemoving] = useMutation<DeleteProjectsButton_DeleteMutation>(REMOVE_MUTATION)

    return <DeleteButton
        isDeleting={isRemoving}
        selectedIds={projectIds}
        className={className}
        singularName={"project"}
        pluralName={"projects"}
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
