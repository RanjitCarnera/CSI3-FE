import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense } from "react";
import { useFragment } from "react-relay";
import { TkButton } from "@components/ui/TkButton";
import { CurrentScenarioControl } from "./CurrentScenarioControl";
import { GenerateReportButton } from "./GenerateReportButton";
import { ScenarioStatistics } from "./ScenarioStatistics";
import { ScenarioViewSwitcher } from "./ScenarioViewSwitcher";
import { type DashboardHeader_ScenarioFragment$key } from "../../__generated__/DashboardHeader_ScenarioFragment.graphql";
import { AccountSwitcher } from "../ui/AccountSwitcher";

const FRAGMENT = graphql`
	fragment DashboardHeader_ScenarioFragment on Scenario {
		id
		...CurrentScenarioControl_ScenarioFragment
		...ScenarioStatistics_ScenarioFragment
	}
`;

interface OwnProps {
	scenarioFragmentRef: DashboardHeader_ScenarioFragment$key;
}

export const DashboardHeader = ({ scenarioFragmentRef }: OwnProps) => {
	const scenario = useFragment<DashboardHeader_ScenarioFragment$key>(
		FRAGMENT,
		scenarioFragmentRef,
	);
	return (
		<div className="flex w-12">
			<CurrentScenarioControl className="mr-3" scenarioFragmentRef={scenario} />
			<Suspense
				fallback={
					<div className="mr-5">
						<TkButton
							disabled
							className="p-1"
							icon="pi pi-chart-line"
							tooltip={"Scenario statistics"}
						/>
					</div>
				}
			>
				<ScenarioStatistics className="mr-5" scenarioFragmentRef={scenario} />
			</Suspense>
			<ScenarioViewSwitcher className="mr-5" />
			<GenerateReportButton className="mr-5" scenarioId={scenario.id} />
			<AccountSwitcher className="ml-auto" />
		</div>
	);
};
