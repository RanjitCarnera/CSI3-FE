import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {EditPersonModal} from "./EditPersonModal";
import {useFragment} from "react-relay";
import {useState} from "react";
import {EditPersonButton_PersonFragment$key} from "../../__generated__/EditPersonButton_PersonFragment.graphql";


const PROJECT_FRAGMENT = graphql`
    fragment EditPersonButton_PersonFragment on Person {
        ...EditPersonModal_PersonFragment
    }
`

interface OwnProps {
    className?: string
    personFragmentRef: EditPersonButton_PersonFragment$key
}


export const EditPersonButton = ({className, personFragmentRef}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const Person = useFragment<EditPersonButton_PersonFragment$key>(PROJECT_FRAGMENT, personFragmentRef)
    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left" label="Edit"
                      onClick={() => setVisible(true)}/>

        <EditPersonModal
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => setVisible(false)}
            personFragmentRef={Person}
        />
    </>

}
