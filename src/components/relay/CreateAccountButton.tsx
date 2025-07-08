import {TkButton} from "../ui/TkButton";
import {useState} from "react";
import {EditAccountModal} from "./EditAccountModal";

interface OwnProps {
    connectionId: string
}

export const CreateAccountButton = ({connectionId}: OwnProps) => {
    const [isVisible, setVisible] = useState<boolean>(false)

    return <div>
        <TkButton
            onClick={() => setVisible(true)}
            label={"Create new account"}/>

        <EditAccountModal
            connectionId={connectionId}
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => {
                setVisible(false)
            }}/>
    </div>

}
