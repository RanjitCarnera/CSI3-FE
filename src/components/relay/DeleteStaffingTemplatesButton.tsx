import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {
    DeleteStaffingTemplatesButton_DeleteMutation
} from "../../__generated__/DeleteStaffingTemplatesButton_DeleteMutation.graphql";
import {DeleteButton} from "../ui/DeleteButton";

const REMOVE_MUTATION = graphql`
    mutation DeleteStaffingTemplatesButton_DeleteMutation($input: DeleteStaffingTemplateInput!, $connections: [ID!]!) {
        Template {
            deleteStaffingTemplate(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }

    }
`

interface OwmProps {
    connectionIds?: string[]
    staffingTemplateIds: string[]
    className?: string
}


export const DeleteStaffingTemplatesButton = ({staffingTemplateIds, connectionIds, className}: OwmProps) => {
    const [remove, isRemoving] = useMutation<DeleteStaffingTemplatesButton_DeleteMutation>(REMOVE_MUTATION)

    return <DeleteButton
        isDeleting={isRemoving}
        selectedIds={staffingTemplateIds}
        className={className}
        singularName={"Staffing Template"}
        pluralName={"Staffing Templates"}
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
