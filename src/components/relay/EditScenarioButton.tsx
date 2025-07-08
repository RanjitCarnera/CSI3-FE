import {graphql} from "babel-plugin-relay/macro";
import {useFragment, useMutation} from "react-relay";
import React, {useState} from "react";
import {TkButtonLink} from "../ui/TkButtonLink";
import {EditScenarioButton_ScenarioFragment$key} from "../../__generated__/EditScenarioButton_ScenarioFragment.graphql";
import {EditScenarioButton_EditMutation} from "../../__generated__/EditScenarioButton_EditMutation.graphql";
import {EditScenarioForm, EditScenarioFormState} from "../ui/EditScenarioForm";
import {SuspenseDialogWithState} from "../ui/SuspenseDialogWithState";

const EDIT_MUTATION = graphql`
    mutation EditScenarioButton_EditMutation($input: EditScenarioInput!) {
        Scenario {
            editScenario(input: $input) {
                edge {
                    node {
                        id
                        name
                        isMasterPlan
                    }
                }
            }
        }
    }
`

const FRAGMENT = graphql`
    fragment EditScenarioButton_ScenarioFragment on Scenario {
        id
        name
    }
`

interface OwnProps {
    className?: string
    scenarioFragmentRef: EditScenarioButton_ScenarioFragment$key
}


export const EditScenarioButton = ({className, scenarioFragmentRef}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const scenario = useFragment<EditScenarioButton_ScenarioFragment$key>(FRAGMENT, scenarioFragmentRef)
    const [edit] = useMutation<EditScenarioButton_EditMutation>(EDIT_MUTATION)

    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left" label="Edit"
                      onClick={() => setVisible(true)}/>

        <SuspenseDialogWithState<EditScenarioFormState>
            title={"Edit scenario"}
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            formComponent={(ref, onHide) => {

                return <EditScenarioForm
                    initialState={{}}
                    ref={ref}
                    onSubmit={(values) => {
                        edit({
                            variables: {
                                input: {
                                    scenarioId: scenario.id,
                                    name: values.name!
                                }
                            },
                            onCompleted: () => {
                                ref.current?.setSubmitting(false)
                                ref.current?.resetForm({})
                                onHide()
                            }
                        })
                    }}
                />
            }
            }/>
    </>

}
