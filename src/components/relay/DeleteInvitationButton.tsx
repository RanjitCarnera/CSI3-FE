import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {useDialogLogic} from "../ui/useDialogLogic";
import {DeleteInvitationButton_DeleteMutation} from "../../__generated__/DeleteInvitationButton_DeleteMutation.graphql";
import {TkButtonLink} from "../ui/TkButtonLink";

const DELETE_MUTATION = graphql`
    mutation DeleteInvitationButton_DeleteMutation($input: DeleteInvitationInput!, $connections: [ID!]!) {
        Management {
            deleteInvitation(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }
    }
`


interface OwnProps {
    invitationId: string
    connectionId: string
}

export const DeleteInvitationButton = ({invitationId, connectionId}: OwnProps) => {
    const [doDelete, isDeleting] = useMutation<DeleteInvitationButton_DeleteMutation>(DELETE_MUTATION)
    const {dialogComponent, showDialog} = useDialogLogic();

    return <div>
        <TkButtonLink
            disabled={isDeleting}
            label={"Delete"}
            onClick={() => {
                showDialog({
                    title: "Delete Invitation",
                    content: "Do you really want to delete this invitation? You can invite the user again later.",
                    affirmativeText: "Delete",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            doDelete({
                                variables: {
                                    input: {invitationId},
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
