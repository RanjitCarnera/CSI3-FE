import {TkButton} from "./TkButton";
import {DeleteConfirmationForm} from "./DeleteConfirmationForm";
import {useState} from "react";


interface OwnProps {
    className?: string
    isDeleting: boolean
    selectedIds: string[]
    singularName: string
    pluralName: string
    doDelete: (selectedIds: string[]) => void
}

export const DeleteButtonWithConfirmation = ({
                                                 className,
                                                 isDeleting,
                                                 selectedIds,
                                                 singularName,
                                                 pluralName,
                                                 doDelete
                                             }: OwnProps) => {
    const [dialogVisible, setDialogVisible] = useState<boolean>(false)

    return <>
        <TkButton
            className={className}
            icon="pi pi-trash"
            iconPos="left"
            label={`Delete ${pluralName}`}
            disabled={isDeleting || selectedIds.length === 0}
            onClick={() => {
                setDialogVisible(true)
            }
            }
        />
        <DeleteConfirmationForm
            title={selectedIds.length === 1 ? `Confirm deletion of ${singularName}` : `Confirm deletion of ${pluralName}`}
            onCompleted={() => doDelete(selectedIds)}
            isVisible={dialogVisible}
            onHide={() => setDialogVisible(false)}/>
    </>
}
