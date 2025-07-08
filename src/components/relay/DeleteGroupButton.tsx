import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {useDialogLogic} from "../ui/useDialogLogic";
import {DeleteGroupButton_DeleteMutation} from "../../__generated__/DeleteGroupButton_DeleteMutation.graphql";
import {TkButtonLink} from "../ui/TkButtonLink";

const DELETE_MUTATION = graphql`
    mutation DeleteGroupButton_DeleteMutation($input: DeleteGroupInput!, $connections: [ID!]!) {
        Management {
            deleteGroup(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }
    }
`


interface OwnProps {
    groupId: string
    connectionId: string
}

export const DeleteGroupButton = ({groupId, connectionId}: OwnProps) => {
    const [doDelete, isDeleting] = useMutation<DeleteGroupButton_DeleteMutation>(DELETE_MUTATION)
    const {dialogComponent, showDialog} = useDialogLogic();

    return <div>
        <TkButtonLink
            disabled={isDeleting}
            label={"Delete"}
            onClick={() => {
                showDialog({
                    title: "Delete group",
                    content: "Do you really want to delete this group?",
                    affirmativeText: "Delete",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            doDelete({
                                variables: {
                                    input: {id: groupId},
                                    connections: [connectionId]
                                }
                            })
                        }
                    }
                })
            }}
            icon="pi pi-trash"/>
        {dialogComponent}
    </div>

}
