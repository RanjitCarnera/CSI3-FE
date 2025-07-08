import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {useDialogLogic} from "../ui/useDialogLogic";
import {
    RemoveUserFromAccountAdminButton_RemoveMutation
} from "../../__generated__/RemoveUserFromAccountAdminButton_RemoveMutation.graphql";
import {TkButtonLink} from "../ui/TkButtonLink";

const DELETE_MUTATION = graphql`
    mutation RemoveUserFromAccountAdminButton_RemoveMutation($input: RemoveUserFromAccountAdminInput!, $connections: [ID!]!) {
        Admin {
            Management {
                removeUserFromAccountAdmin(input: $input) {
                    deletedIds @deleteEdge(connections: $connections)
                }
            }
        }
    }
`


interface OwnProps {
    accountId: string
    userId: string
    connectionId: string
}

export const RemoveUserFromAccountAdminButton = ({accountId, connectionId, userId}: OwnProps) => {
    const [doDelete, isDeleting] = useMutation<RemoveUserFromAccountAdminButton_RemoveMutation>(DELETE_MUTATION)
    const {dialogComponent, showDialog} = useDialogLogic();

    return <div>
        <TkButtonLink
            disabled={isDeleting}
            onClick={() => {
                showDialog({
                    title: "Remove user from account",
                    content: "Do you really want to remove this user from this account? You can add the user again later.",
                    affirmativeText: "Remove",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            doDelete({
                                variables: {
                                    input: {accountId: accountId, userId: userId},
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
