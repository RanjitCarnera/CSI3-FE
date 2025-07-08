import React from "react";
import {ProgressSpinner} from "primereact/progressspinner";

export const Loader = () => {
    return <div className="flex flex-grow-1 justify-content-center align-items-center">
        <ProgressSpinner style={{width: 100, height: 100}}/>
    </div>
}
