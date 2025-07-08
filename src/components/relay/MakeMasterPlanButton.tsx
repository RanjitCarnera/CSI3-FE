import {graphql} from "babel-plugin-relay/macro";
import {useFragment, useMutation} from "react-relay";
import {
    MakeMasterPlanButton_ScenarioFragment$key
} from "../../__generated__/MakeMasterPlanButton_ScenarioFragment.graphql";
import {TkButton} from "../ui/TkButton";
import {
    MakeMasterPlanButton_MakeMasterPlanMutation
} from "../../__generated__/MakeMasterPlanButton_MakeMasterPlanMutation.graphql";
import {useDialogLogic} from "../ui/useDialogLogic";

const MAKE_MASTER_MUTATION = graphql`
    mutation MakeMasterPlanButton_MakeMasterPlanMutation($input: ChangeMasterPlanInput!) {
        Scenario {
            changeMasterPlan(input: $input) {
                edge {
                    node {
                        ...MakeMasterPlanButton_ScenarioFragment
                    }
                }
            }
        }
    }
`

const SCENARIO_FRAGMENT = graphql`
    fragment MakeMasterPlanButton_ScenarioFragment on Scenario {
        id
        isMasterPlan
    }
`

interface OwnProps {
    className?: string
    scenarioFragmentRef: MakeMasterPlanButton_ScenarioFragment$key
    onCompleted: () => void
}

export const MakeMasterPlanButton = ({className, scenarioFragmentRef, onCompleted}: OwnProps) => {
    const {dialogComponent, showDialog} = useDialogLogic()
    const scenario = useFragment<MakeMasterPlanButton_ScenarioFragment$key>(SCENARIO_FRAGMENT, scenarioFragmentRef)
    const [makeMasterPlan, isMakingMasterPlan] = useMutation<MakeMasterPlanButton_MakeMasterPlanMutation>(MAKE_MASTER_MUTATION)

    return <><TkButton
        className={className}
        disabled={scenario.isMasterPlan || isMakingMasterPlan}

        label="Make master" onClick={() => {
        showDialog({
            title: "Change the master plan",
            content: "The master plan cannot be edited by everyone. Only one scenario can be master plan.",
            affirmativeText: "Make master plan",
            negativeText: "Cancel",
            dialogCallback: result => {
                if (result === "Accept") {
                    makeMasterPlan({
                        variables: {
                            input: {
                                scenarioId: scenario.id,
                            }
                        },
                        onCompleted: () => {
                            onCompleted()
                        }
                    })
                }
            }
        })
    }}>

    </TkButton>
        {dialogComponent}
    </>

}
