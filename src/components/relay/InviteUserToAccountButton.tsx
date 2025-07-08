import {TkButton} from "../ui/TkButton";
import {useState} from "react";
import {InviteUserToAccountModal} from "./InviteUserToAccountModal";

interface OwnProps {
    connectionId: string
}

export const InviteUserToAccountButton = ({connectionId}: OwnProps) => {
    const [isVisible, setVisible] = useState<boolean>(false)

    return <div>
        <TkButton
            onClick={() => setVisible(true)}
            label={"Invite user"}/>

        <InviteUserToAccountModal
            connectionId={connectionId}
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => {
                setVisible(false)
            }}/>
    </div>

}
