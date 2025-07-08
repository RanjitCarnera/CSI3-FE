import {graphql} from "babel-plugin-relay/macro";
import {useFragment, useMutation} from "react-relay";
import {
    ProjectStageSortOrderButtons_ProjectStageFragment$key
} from "../../__generated__/ProjectStageSortOrderButtons_ProjectStageFragment.graphql";
import {
    ProjectStageSortOrderButtons_IncreaseMutation
} from "../../__generated__/ProjectStageSortOrderButtons_IncreaseMutation.graphql";
import {
    ProjectStageSortOrderButtons_DecreaseMutation
} from "../../__generated__/ProjectStageSortOrderButtons_DecreaseMutation.graphql";
import {TkButtonLink} from "../ui/TkButtonLink";


const INCREASE_MUTATION = graphql`
    mutation ProjectStageSortOrderButtons_IncreaseMutation($input: IncreaseProjectStageSortOrderInput!) {
        Project {
            increaseProjectStageSortOrder(input: $input) {
                edge {
                    node {
                        id
                        sortOrder
                    }
                }
            }
        }
    }
`

const DECREASE_MUTATION = graphql`
    mutation ProjectStageSortOrderButtons_DecreaseMutation($input: DecreaseProjectStageSortOrderInput!) {
        Project {
            decreaseProjectStageSortOrder(input: $input) {
                edge {
                    node {
                        id
                        sortOrder
                    }
                }
            }
        }
    }
`


const FRAGMENT = graphql`
    fragment ProjectStageSortOrderButtons_ProjectStageFragment on ProjectStage {
        id
        sortOrder
    }
`

interface OwnProps {
    projectStageFragmentRef: ProjectStageSortOrderButtons_ProjectStageFragment$key
}

export const ProjectStageSortOrderButtons = ({projectStageFragmentRef}: OwnProps) => {
    const projectStage = useFragment<ProjectStageSortOrderButtons_ProjectStageFragment$key>(FRAGMENT, projectStageFragmentRef)
    const [increase, isIncreasing] = useMutation<ProjectStageSortOrderButtons_IncreaseMutation>(INCREASE_MUTATION)
    const [decrease, isDecreasing] = useMutation<ProjectStageSortOrderButtons_DecreaseMutation>(DECREASE_MUTATION)


    return <div className="flex align-items-center">
        <TkButtonLink className="mr-2" disabled={isIncreasing || isDecreasing} icon="pi pi-chevron-up" onClick={() => {
            decrease({variables: {input: {id: projectStage.id}}})
        }}/>
        <div className="mr-2">{projectStage.sortOrder}</div>
        <TkButtonLink disabled={isIncreasing || isDecreasing} icon="pi pi-chevron-down" onClick={() => {
            increase({variables: {input: {id: projectStage.id}}})

        }}/>
    </div>
}
