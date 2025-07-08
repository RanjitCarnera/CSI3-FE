import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {useFragment} from "react-relay";
import {useState} from "react";
import {ChangeAccountGroupsAdminModal} from "./ChangeAccountGroupsAdminModal";
import {
    ChangeAccountGroupsAdminButton_AccountFragment$key
} from "../../__generated__/ChangeAccountGroupsAdminButton_AccountFragment.graphql";


const FRAGMENT = graphql`
    fragment ChangeAccountGroupsAdminButton_AccountFragment on Account {
        ...ChangeAccountGroupsAdminModal_AccountFragment
    }
`

interface OwnProps {
    className?: string
    accountFragmentRef: ChangeAccountGroupsAdminButton_AccountFragment$key
}


export const ChangeAccountGroupsAdminButton = ({className, accountFragmentRef}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const account = useFragment<ChangeAccountGroupsAdminButton_AccountFragment$key>(FRAGMENT, accountFragmentRef)
    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left"
                      onClick={() => setVisible(true)}/>

        <ChangeAccountGroupsAdminModal
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => setVisible(false)}
            accountFragmentRef={account}
        />
    </>

}
