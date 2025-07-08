import {Tooltip} from "primereact/tooltip";

interface OwnProps {
    className?: string
}

export const NoApplicableRolesIcon = ({className}: OwnProps) => {

    return <div className={className}>
        <Tooltip target=".custom-target-icon"/>
        <i className="custom-target-icon pi pi-exclamation-triangle warning"
           data-pr-tooltip="This person's job title is not applicable to any of these assignment's roles."
           data-pr-position="right" data-pr-at="right+5 top" data-pr-my="left center-2"/>
    </div>
}
