import {graphql} from "babel-plugin-relay/macro";
import {useFragment, useMutation} from "react-relay";
import {
    ToggleVisibilityButton_ScenarioFragment$key
} from "../../__generated__/ToggleVisibilityButton_ScenarioFragment.graphql";
import {TkButton} from "../ui/TkButton";
import {
    ToggleVisibilityButton_ToggleVisibilityMutation
} from "../../__generated__/ToggleVisibilityButton_ToggleVisibilityMutation.graphql";
import {useDialogLogic} from "../ui/useDialogLogic";

const MUTATION = graphql`
    mutation ToggleVisibilityButton_ToggleVisibilityMutation($input: ChangeScenarioVisibilityInput!) {
        Scenario {
            changeScenarioVisibility(input: $input) {
                edge {
                    node {
                        ...ToggleVisibilityButton_ScenarioFragment
                    }
                }
            }
        }
    }
`

const SCENARIO_FRAGMENT = graphql`
    fragment ToggleVisibilityButton_ScenarioFragment on Scenario {
        id
        isPublic
        isMasterPlan
    }
`

interface OwnProps {
    className?: string
    scenarioFragmentRef: ToggleVisibilityButton_ScenarioFragment$key
    onCompleted: () => void
}

export const ToggleVisibilityButton = ({className, scenarioFragmentRef, onCompleted}: OwnProps) => {
    const {dialogComponent, showDialog} = useDialogLogic()
    const scenario = useFragment<ToggleVisibilityButton_ScenarioFragment$key>(SCENARIO_FRAGMENT, scenarioFragmentRef)
    const [changeVisibility, isChanging] = useMutation<ToggleVisibilityButton_ToggleVisibilityMutation>(MUTATION)

    return !scenario.isMasterPlan ? <><TkButton
        className={className}
        disabled={isChanging}

        label={scenario.isPublic ? "Make Private" : "Make Public"}

        onClick={() => {
            if (scenario.isPublic) {
                changeVisibility({
                    variables: {
                        input: {
                            scenarioId: scenario.id,
                            isPublic: false
                        }
                    },
                    onCompleted: () => {
                        onCompleted()
                    }
                })
            } else {
                showDialog({
                    title: "Make this scenario public?",
                    content: "Everyone in your organization will be able to view and edit this scenario. You can make it private at any time.",
                    affirmativeText: "Make public",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            changeVisibility({
                                variables: {
                                    input: {
                                        scenarioId: scenario.id,
                                        isPublic: true
                                    }
                                },
                                onCompleted: () => {
                                    onCompleted()
                                }
                            })
                        }
                    }
                })
            }


        }}>

    </TkButton>
        {dialogComponent}
    </> : null

}
