import {TkButtonLink} from "./TkButtonLink";
import {classNames} from "primereact/utils";
import DynamicsIcon from "../../assets/dynamics-icon.png"
import React from "react";

interface OwnProps {
    className?: string
}

export const FromDynamicsIcon = ({className}: OwnProps) => {
    return <TkButtonLink className={classNames("p-0 w-auto warning", className)}
                         icon={<img alt="dynamics" src={DynamicsIcon} height={16} width={16}/>}
                         tooltip={"Is from dynamics"}/>
}
