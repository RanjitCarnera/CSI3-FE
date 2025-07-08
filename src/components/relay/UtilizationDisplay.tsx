import {graphql} from "babel-plugin-relay/macro";
import {useFragment} from "react-relay";
import {
    UtilizationDisplay_UtilizationFragment$key
} from "../../__generated__/UtilizationDisplay_UtilizationFragment.graphql";
import {Tooltip} from "primereact/tooltip";
import React from "react";


const GAP_DAYS_FRAGMENT = graphql`
    fragment UtilizationDisplay_UtilizationFragment on ScenarioUtilization {
        averageUtilizationPercentage
        unusedSalary
    }
`

interface OwnProps {
    className?: string
    utilizationFragmentRef: UtilizationDisplay_UtilizationFragment$key
}

export const UtilizationDisplay = ({className, utilizationFragmentRef}: OwnProps) => {
    const utilization = useFragment<UtilizationDisplay_UtilizationFragment$key>(GAP_DAYS_FRAGMENT, utilizationFragmentRef)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return <div className={`grid tiny-text ${className || ""}`}>
        <Tooltip target={"#utilization-percentage-display"}
                 content={"Average utilization percentage in current scenario"}/>

        <div id="utilization-percentage-display" className="flex align-items-center col-6"><i
            className="pi pi-percentage mr-1"/>{(utilization.averageUtilizationPercentage * 100).toFixed(2)}%
            utilization
        </div>

        <Tooltip target={"#utilization-salary-display"}
                 content={"Average utilization percentage in current scenario"}/>

        <div id="utilization-salary-display" className="flex align-items-center col-6"><i
            className="pi pi-thumbs-down mr-1"/>{formatter.format(utilization.unusedSalary)} unutilized salary
        </div>
    </div>
}
