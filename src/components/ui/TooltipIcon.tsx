import {TkButtonLink} from "./TkButtonLink";
import {classNames} from "primereact/utils";

interface OwnProps {
    icon?: string
    className?: string
    tooltip?: string
}

export const TooltipIcon = ({icon, className, tooltip}: OwnProps) => {
    return <TkButtonLink className={classNames("p-0 w-auto", className)}
                         icon={icon}
                         tooltip={tooltip}/>
}
