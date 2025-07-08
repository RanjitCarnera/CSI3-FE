import {graphql} from "babel-plugin-relay/macro";
import {useFragment} from "react-relay";
import {
    UtilizationOverTimeGraph_PersonFragment$key
} from "../../__generated__/UtilizationOverTimeGraph_PersonFragment.graphql";
import {TkChart} from "../ui/TkChart";
import {formatMonthYear} from "../ui/DateTimeDisplay";

const FRAGMENT = graphql`
    fragment UtilizationOverTimeGraph_PersonFragment on Person @argumentDefinitions(scenarioId: {type: "ID!"}) {
        name
        utilizationOverTime(scenarioRef: $scenarioId) {
            date
            utilizationPercentage
        }
    }
`

interface OwnProps {
    personFragmentRef: UtilizationOverTimeGraph_PersonFragment$key
}

export const PERCENT_NUMBER_FORMAT = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}

export const UtilizationOverTimeGraph = ({personFragmentRef}: OwnProps) => {
    const person = useFragment<UtilizationOverTimeGraph_PersonFragment$key>(FRAGMENT, personFragmentRef)

    return <TkChart
        height={"300px"}
        chartName={`Utilization over time of ${person.name}`}
        data={{
            labels: person.utilizationOverTime.map(i => formatMonthYear(i.date)),
            datasets: [
                {
                    type: "line",
                    label: 'Utilization percentage over time',
                    data: person.utilizationOverTime.map(i => i.utilizationPercentage),
                }
            ],
        }}
        options={{
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        format: PERCENT_NUMBER_FORMAT,

                    }
                }
            }
        }
        }
    />
}