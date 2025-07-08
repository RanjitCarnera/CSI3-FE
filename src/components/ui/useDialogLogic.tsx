import {ReactNode, useState} from "react";
import {TkDialog} from "./TkDialog";
import {TkButton} from "./TkButton";

interface DialogSettings {
    title: string
    content: string
    dialogCallback: DialogCallback;
    affirmativeText?: string
    negativeText?: string
}

interface DialogHookProps {
    dialogComponent: ReactNode
    showDialog: (settings: DialogSettings) => void;
}

type DialogResult = "Accept" | "Deny"

type DialogCallback = (result: DialogResult) => void

interface DialogState extends DialogSettings {
    dialogCallback: DialogCallback;
    dialogVisible: boolean
}

const INITIAL_STATE = {
    dialogCallback: () => {
    },
    title: "Untitled",
    content: "No content",
    affirmativeText: "Yes",
    negativeText: "No",
    dialogVisible: false
};

export const useDialogLogic = (): DialogHookProps => {
    const [dialogState, setDialogState] = useState<DialogState>(INITIAL_STATE)

    return {
        dialogComponent: dialogState.dialogVisible ? <TkDialog
            header={dialogState.title}
            visible={true}
            footer={<div>
                <TkButton
                    label={dialogState.negativeText || "Cancel"}
                    icon="pi pi-times"
                    onClick={() => {
                        dialogState.dialogCallback("Deny")
                        setDialogState(INITIAL_STATE)
                    }}
                    className="p-button-text"/>
                <TkButton
                    label={dialogState.affirmativeText || "Accept"}
                    icon="pi pi-check"
                    onClick={() => {
                        dialogState.dialogCallback("Accept")
                        setDialogState(INITIAL_STATE)
                    }}
                    autoFocus/>
            </div>}
            onHide={() => {
                dialogState.dialogCallback("Deny")
                setDialogState(INITIAL_STATE)
            }}>
            <div dangerouslySetInnerHTML={{__html: dialogState.content}}/>
        </TkDialog> : null,

        showDialog: (settings: DialogSettings) => {
            setDialogState({
                ...settings,
                dialogVisible: true,
            })
        }
    }

}
