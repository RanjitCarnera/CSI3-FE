import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {useFragment, useMutation} from "react-relay";
import {
    AnonymizeAccountButton_AccountFragment$key
} from "../../__generated__/AnonymizeAccountButton_AccountFragment.graphql";
import {useDialogLogic} from "../ui/useDialogLogic";
import {AnonymizeAccountButton_DeleteMutation} from "../../__generated__/AnonymizeAccountButton_DeleteMutation.graphql";

const REMOVE_MUTATION = graphql`
    mutation AnonymizeAccountButton_DeleteMutation($input: AnonymizeAccountAdminInput!, $connections: [ID!]!) {
        Admin {
            Management {
                anonymizeAccountAdmin(input: $input) {
                    deletedIds @deleteEdge(connections: $connections)
                    clientMutationId
                }
            }
        }

    }
`

const AccountT_FRAGMENT = graphql`
    fragment AnonymizeAccountButton_AccountFragment on Account {
        id
        name
    }
`

interface OwmProps {
    connectionId: string
    className?: string
    accountFragmentRef: AnonymizeAccountButton_AccountFragment$key
}


export const AnonymizeAccountButton = ({connectionId, className, accountFragmentRef}: OwmProps) => {
    const account = useFragment<AnonymizeAccountButton_AccountFragment$key>(AccountT_FRAGMENT, accountFragmentRef)
    const [remove, isRemoving] = useMutation<AnonymizeAccountButton_DeleteMutation>(REMOVE_MUTATION)

    const {dialogComponent, showDialog} = useDialogLogic();

    return <>
        <TkButtonLink
            className={className}
            icon="pi pi-trash"
            iconPos="left"
            label="Delete"
            disabled={isRemoving}
            onClick={() => {
                showDialog({
                    title: `Anonymize Account  ${account.name}`,
                    content: "Do you really want to anonymize this Account? This cannot be undone.",
                    affirmativeText: "Anonymize",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            remove({
                                variables: {
                                    input: {
                                        id: account.id,
                                    },
                                    connections: [connectionId]
                                }
                            })
                        }
                    }
                })
            }
            }
        />
        {dialogComponent}
    </>

}
