import {TkButtonLink} from "./TkButtonLink";
import {classNames} from "primereact/utils";

interface OwnProps {
    className?: string
}

export const IsExecutiveIcon = ({className}: OwnProps) => {
    return <TkButtonLink className={classNames("p-0 w-auto warning", className)}
                         icon="pi pi-star-fill"
                         tooltip={"Is executive role"}/>
}
