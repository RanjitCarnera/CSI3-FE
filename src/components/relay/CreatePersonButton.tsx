import {TkButton} from "../ui/TkButton";
import {useState} from "react";
import {EditPersonModal} from "./EditPersonModal";

interface OwnProps {
    className?: string
    connectionId: string
}

export const CreatePersonButton = ({className, connectionId}: OwnProps) => {
    const [isVisible, setVisible] = useState<boolean>(false)

    return <div className={className}>
        <TkButton
            onClick={() => setVisible(true)}
            label={"Create new person"}/>

        <EditPersonModal
            connectionId={connectionId}
            isVisible={isVisible}
            onHide={() => setVisible(false)}
            onCompleted={() => {
                setVisible(false)
            }}/>
    </div>

}
