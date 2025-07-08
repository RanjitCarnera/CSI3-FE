import {graphql} from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {TkButton} from "../ui/TkButton";
import {
    ResolveProjectsGpsCoordinatesButton_FetchMutation
} from "../../__generated__/ResolveProjectsGpsCoordinatesButton_FetchMutation.graphql";

const IMPORT_MUTATION = graphql`
    mutation ResolveProjectsGpsCoordinatesButton_FetchMutation($input: ResolveProjectsGpsCoordinatesInput!) {
        Project {
            resolveProjectsGpsCoordinates(input: $input) {
                updatedProjects {
                    id
                    address {
                        latitude
                        longitude
                    }
                }
            }
        }
    }
`

interface OwnProps {
    selectedProjectsIds: string[]
    className?: string
}


export const ResolveProjectsGpsCoordinatesButton = ({className, selectedProjectsIds}: OwnProps) => {
    const [resolveGpsCoordinates, isResolving] = useMutation<ResolveProjectsGpsCoordinatesButton_FetchMutation>(IMPORT_MUTATION)
    return <TkButton
        className={className}
        icon="pi pi-replay"
        iconPos="left"
        tooltip={"You can use this to fix incomplete address warnings in the projects table."}
        label={isResolving ? "Resolving..." : "Resolve GPS coordinates"}
        disabled={isResolving || selectedProjectsIds.length === 0}
        onClick={() => resolveGpsCoordinates({
            variables: {
                input: {
                    projectIds: selectedProjectsIds
                }
            }
        })}
    />
}


