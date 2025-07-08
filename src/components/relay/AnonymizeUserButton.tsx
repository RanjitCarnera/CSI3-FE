import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {useFragment, useMutation} from "react-relay";
import {AnonymizeUserButton_UserFragment$key} from "../../__generated__/AnonymizeUserButton_UserFragment.graphql";
import {useDialogLogic} from "../ui/useDialogLogic";
import {AnonymizeUserButton_DeleteMutation} from "../../__generated__/AnonymizeUserButton_DeleteMutation.graphql";

const MUTATION = graphql`
    mutation AnonymizeUserButton_DeleteMutation($input: DeleteUserInput!, $connections: [ID!]!) {
        Admin {
            Auth {
                deleteUser(input: $input) {
                    deletedIds @deleteEdge(connections: $connections)
                    clientMutationId
                }
            }
        }

    }
`

const FRAGMENT = graphql`
    fragment AnonymizeUserButton_UserFragment on User {
        id
        name
    }
`

interface OwmProps {
    connectionId: string
    className?: string
    userFragmentRef: AnonymizeUserButton_UserFragment$key
}


export const AnonymizeUserButton = ({connectionId, className, userFragmentRef}: OwmProps) => {
    const user = useFragment<AnonymizeUserButton_UserFragment$key>(FRAGMENT, userFragmentRef)
    const [remove, isRemoving] = useMutation<AnonymizeUserButton_DeleteMutation>(MUTATION)

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
                    title: `Anonymize User  ${user.name}`,
                    content: "Do you really want to anonymize this User? This cannot be undone.",
                    affirmativeText: "Anonymize",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            remove({
                                variables: {
                                    input: {
                                        userId: user.id,
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
