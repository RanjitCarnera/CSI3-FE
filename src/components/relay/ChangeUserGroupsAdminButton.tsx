import {graphql} from "babel-plugin-relay/macro";
import {TkButtonLink} from "../ui/TkButtonLink";
import {useFragment} from "react-relay";
import {useState} from "react";
import {
    ChangeUserGroupsAdminButton_UserInAccountFragment$key
} from "../../__generated__/ChangeUserGroupsAdminButton_UserInAccountFragment.graphql";
import {ChangeUserGroupsAdminModal} from "./ChangeUserGroupsAdminModal";


const FRAGMENT = graphql`
    fragment ChangeUserGroupsAdminButton_UserInAccountFragment on UserInAccount {
        ...ChangeUserGroupsAdminModal_UserInAccountFragment
    }
`

interface OwnProps {
    accountId: string
    className?: string
    userInAccountFragment: ChangeUserGroupsAdminButton_UserInAccountFragment$key
}


export const ChangeUserGroupsAdminButton = ({accountId, className, userInAccountFragment}: OwnProps) => {
    const [isVisible, setVisible] = useState(false)
    const userInAccount = useFragment<ChangeUserGroupsAdminButton_UserInAccountFragment$key>(FRAGMENT, userInAccountFragment)
    return <>
        <TkButtonLink className={className} icon="pi pi-pencil" iconPos="left"
                      onClick={() => setVisible(true)}/>

        <ChangeUserGroupsAdminModal
            accountId={accountId}
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => setVisible(false)}
            userInAccountFragmentRef={userInAccount}
        />
    </>

}
