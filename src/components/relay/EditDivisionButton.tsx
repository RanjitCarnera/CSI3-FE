import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {EditDivisionModal} from "./EditDivisionModal";
import {useFragment} from "react-relay";
import {useState} from "react";
import {EditDivisionButton_DivisionFragment$key} from "../../__generated__/EditDivisionButton_DivisionFragment.graphql";


const PROJECT_FRAGMENT = graphql`
    fragment EditDivisionButton_DivisionFragment on Division {
        ...EditDivisionModal_DivisionFragment
    }
`

interface OwnProps {
    className?: string
    divisionFragmentRef: EditDivisionButton_DivisionFragment$key
}


export const EditDivisionButton = ({className, divisionFragmentRef}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const Division = useFragment<EditDivisionButton_DivisionFragment$key>(PROJECT_FRAGMENT, divisionFragmentRef)
    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left" label="Edit"
                      onClick={() => setVisible(true)}/>

        <EditDivisionModal
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => setVisible(false)}
            DivisionFragmentRef={Division}
        />
    </>

}
