import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {DeleteScenariosButton_DeleteMutation} from "../../__generated__/DeleteScenariosButton_DeleteMutation.graphql";
import {DeleteButton} from "../ui/DeleteButton";
import {DeleteButtonWithConfirmation} from "../ui/DeleteButtonWithConfirmation";

const DELETE_MUTATION = graphql`
    mutation DeleteScenariosButton_DeleteMutation($input: DeleteScenarioInput!, $connections: [ID!]!) {
        Scenario {
            deleteScenario(input: $input) {
                deletedIds @deleteEdge(connections: $connections)
            }
        }
    }
`


interface OwnProps {
    className?: string
    scenarioIds: string[]
    isDeletingMasterPlan: boolean
    connectionIds: string[]
}

export const DeleteScenariosButton = ({className, isDeletingMasterPlan, scenarioIds, connectionIds}: OwnProps) => {
    const [remove, isRemoving] = useMutation<DeleteScenariosButton_DeleteMutation>(DELETE_MUTATION)

    return isDeletingMasterPlan ? <DeleteButtonWithConfirmation
        isDeleting={isRemoving}
        selectedIds={scenarioIds}
        className={className}
        singularName={"Scenario"}
        pluralName={"Scenarios"}
        doDelete={ids => {
            remove({
                variables: {
                    input: {
                        ids: ids,
                    },
                    connections: connectionIds || []
                },
                onCompleted: () => {
                    window.location.reload()
                }
            })
        }}
    /> : <DeleteButton
        isDeleting={isRemoving}
        selectedIds={scenarioIds}
        className={className}
        singularName={"Scenario"}
        pluralName={"Scenarios"}
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
