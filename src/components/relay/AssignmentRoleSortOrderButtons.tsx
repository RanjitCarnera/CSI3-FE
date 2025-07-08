import {graphql} from "babel-plugin-relay/macro";
import {useFragment, useMutation} from "react-relay";
import {
    AssignmentRoleSortOrderButtons_AssignmentRoleFragment$key
} from "../../__generated__/AssignmentRoleSortOrderButtons_AssignmentRoleFragment.graphql";
import {
    AssignmentRoleSortOrderButtons_IncreaseMutation
} from "../../__generated__/AssignmentRoleSortOrderButtons_IncreaseMutation.graphql";
import {
    AssignmentRoleSortOrderButtons_DecreaseMutation
} from "../../__generated__/AssignmentRoleSortOrderButtons_DecreaseMutation.graphql";
import {TkButtonLink} from "../ui/TkButtonLink";


const INCREASE_MUTATION = graphql`
    mutation AssignmentRoleSortOrderButtons_IncreaseMutation($input: IncreaseAssignmentRoleSortOrderInput!) {
        Assignment {
            increaseAssignmentRoleSortOrder(input: $input) {
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
    mutation AssignmentRoleSortOrderButtons_DecreaseMutation($input: DecreaseAssignmentRoleSortOrderInput!) {
        Assignment {
            decreaseAssignmentRoleSortOrder(input: $input) {
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
    fragment AssignmentRoleSortOrderButtons_AssignmentRoleFragment on AssignmentRole {
        id
        sortOrder
    }
`

interface OwnProps {
    assignmentRoleFragmentRef: AssignmentRoleSortOrderButtons_AssignmentRoleFragment$key
}

export const AssignmentRoleSortOrderButtons = ({assignmentRoleFragmentRef}: OwnProps) => {
    const assignmentRole = useFragment<AssignmentRoleSortOrderButtons_AssignmentRoleFragment$key>(FRAGMENT, assignmentRoleFragmentRef)
    const [increase, isIncreasing] = useMutation<AssignmentRoleSortOrderButtons_IncreaseMutation>(INCREASE_MUTATION)
    const [decrease, isDecreasing] = useMutation<AssignmentRoleSortOrderButtons_DecreaseMutation>(DECREASE_MUTATION)


    return <div className="flex align-items-center">
        <TkButtonLink className="mr-2" disabled={isIncreasing || isDecreasing} icon="pi pi-chevron-up" onClick={() => {
            decrease({variables: {input: {id: assignmentRole.id}}})
        }}/>
        <div className="mr-2">{assignmentRole.sortOrder}</div>
        <TkButtonLink disabled={isIncreasing || isDecreasing} icon="pi pi-chevron-down" onClick={() => {
            increase({variables: {input: {id: assignmentRole.id}}})

        }}/>
    </div>
}
