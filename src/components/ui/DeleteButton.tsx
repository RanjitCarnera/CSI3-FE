import {useDialogLogic} from "./useDialogLogic";
import {TkButton} from "./TkButton";


interface OwnProps {
    className?: string
    isDeleting: boolean
    selectedIds: string[]
    singularName: string
    pluralName: string
    doDelete: (selectedIds: string[]) => void
}

export const DeleteButton = ({className, isDeleting, selectedIds, singularName, pluralName, doDelete}: OwnProps) => {
    const {dialogComponent, showDialog} = useDialogLogic();

    return <>
        <TkButton
            className={className}
            icon="pi pi-trash"
            iconPos="left"
            label={`Delete ${pluralName}`}
            disabled={isDeleting || selectedIds.length === 0}
            onClick={() => {
                showDialog({
                    title: selectedIds.length === 1 ? `Delete ${singularName}` : `Delete ${pluralName}`,
                    content: `Do you really want to delete ${selectedIds.length === 1 ? `this ${singularName}` : `these ${pluralName}`}? This cannot be undone.`,
                    affirmativeText: "Delete",
                    negativeText: "Cancel",
                    dialogCallback: result => {
                        if (result === "Accept") {
                            doDelete(selectedIds)
                        }
                    }
                })
            }
            }
        />
        {dialogComponent}
    </>
}
