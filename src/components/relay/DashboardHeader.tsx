import { CurrentScenarioControl } from "./CurrentScenarioControl";
import { ScenarioViewSwitcher } from "./ScenarioViewSwitcher";
import { GenerateReportButton } from "./GenerateReportButton";
import { graphql } from "babel-plugin-relay/macro";
import { useFragment } from "react-relay";
import { DashboardHeader_ScenarioFragment$key } from "../../__generated__/DashboardHeader_ScenarioFragment.graphql";
import { AccountSwitcher } from "../ui/AccountSwitcher";
import React from "react";
import { ScenarioStatistics } from "./ScenarioStatistics";

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
    scenarioFragmentRef
  );
  return (
    <div className="flex w-12">
      <CurrentScenarioControl className="mr-3" scenarioFragmentRef={scenario} />
      <ScenarioStatistics className="mr-5" scenarioFragmentRef={scenario} />
      <ScenarioViewSwitcher className="mr-5" />
      <GenerateReportButton className="mr-5" scenarioId={scenario.id} />
      <AccountSwitcher className="ml-auto" />
    </div>
  );
};
