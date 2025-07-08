import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {EditStaffingTemplateModal} from "./EditStaffingTemplateModal";
import {useFragment} from "react-relay";
import {useState} from "react";
import {
    EditStaffingTemplateButton_StaffingTemplateFragment$key
} from "../../__generated__/EditStaffingTemplateButton_StaffingTemplateFragment.graphql";


const PROJECT_FRAGMENT = graphql`
    fragment EditStaffingTemplateButton_StaffingTemplateFragment on StaffingTemplate {
        ...EditStaffingTemplateModal_StaffingTemplateFragment
    }
`

interface OwnProps {
    className?: string
    staffingTemplateFragmentRef: EditStaffingTemplateButton_StaffingTemplateFragment$key
}


export const EditStaffingTemplateButton = ({className, staffingTemplateFragmentRef}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const StaffingTemplate = useFragment<EditStaffingTemplateButton_StaffingTemplateFragment$key>(PROJECT_FRAGMENT, staffingTemplateFragmentRef)
    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left" label="Edit"
                      onClick={() => setVisible(true)}/>

        <EditStaffingTemplateModal
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => setVisible(false)}
            staffingTemplateFragmentRef={StaffingTemplate}
        />
    </>

}
