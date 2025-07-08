import {graphql} from "babel-plugin-relay/macro";
import {useFragment} from "react-relay";
import {GapDaysDisplay_GapDaysFragment$key} from "../../__generated__/GapDaysDisplay_GapDaysFragment.graphql";
import React from "react";
import {Tooltip} from "primereact/tooltip";


const GAP_DAYS_FRAGMENT = graphql`
    fragment GapDaysDisplay_GapDaysFragment on ScenarioGapDays {
        gapDays
        gapSalary
    }
`

interface OwnProps {
    className?: string
    gapDaysFragmentRef: GapDaysDisplay_GapDaysFragment$key
}

export const GapDaysDisplay = ({className, gapDaysFragmentRef}: OwnProps) => {
    const gapDays = useFragment<GapDaysDisplay_GapDaysFragment$key>(GAP_DAYS_FRAGMENT, gapDaysFragmentRef)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return <div className={`grid tiny-text ${className || ""}`}>
        <Tooltip target={"#gap-days-display"} content={"Total gap days in current scenario"}/>
        <div id="gap-days-display" className="flex align-items-center col-6"><i
            className="pi pi-calendar"/> {gapDays.gapDays} gap days
        </div>
        <Tooltip target={"#gap-salary-display"} content={"Total gap salary in current scenario"}/>

        <div id="gap-salary-display" className="flex align-items-center col-6"><i
            className="pi pi-arrows-h mr-1"/>{formatter.format(gapDays.gapSalary)} gap salary
        </div>
    </div>
}
