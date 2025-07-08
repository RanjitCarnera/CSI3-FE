import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {EditRegionModal} from "./EditRegionModal";
import {useFragment} from "react-relay";
import {useState} from "react";
import {EditRegionButton_RegionFragment$key} from "../../__generated__/EditRegionButton_RegionFragment.graphql";


const PROJECT_FRAGMENT = graphql`
    fragment EditRegionButton_RegionFragment on Region {
        ...EditRegionModal_RegionFragment
    }
`

interface OwnProps {
    className?: string
    regionFragmentRef: EditRegionButton_RegionFragment$key
}


export const EditRegionButton = ({className, regionFragmentRef}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const Region = useFragment<EditRegionButton_RegionFragment$key>(PROJECT_FRAGMENT, regionFragmentRef)
    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left" label="Edit"
                      onClick={() => setVisible(true)}/>

        <EditRegionModal
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => setVisible(false)}
            RegionFragmentRef={Region}
        />
    </>

}
