import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {useDialogLogic} from "../ui/useDialogLogic";
import {
    RemoveUserFromAccountButton_RemoveMutation
} from "../../__generated__/RemoveUserFromAccountButton_RemoveMutation.graphql";
import {TkButtonLink} from "../ui/TkButtonLink";

const DELETE_MUTATION = graphql`
    mutation RemoveUserFromAccountButton_RemoveMutation($input: RemoveUserFromAccountInput!, $connections: [ID!]!) {
        Management {
            removeUserFromAccount(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }
    }
`


interface OwnProps {
    userId: string
    connectionId: string
}

export const RemoveUserFromAccountButton = ({userId, connectionId}: OwnProps) => {
    const [doDelete, isDeleting] = useMutation<RemoveUserFromAccountButton_RemoveMutation>(DELETE_MUTATION)
    const {dialogComponent, showDialog} = useDialogLogic();

    return <div>
        <TkButtonLink
            disabled={isDeleting}
            onClick={() => {
                showDialog({
                    title: "Remove user from account",
                    content: "Do you really want to remove this user from your account? You can invite the user again later.",
                    affirmativeText: "Remove",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            doDelete({
                                variables: {
                                    input: {userId: userId},
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
