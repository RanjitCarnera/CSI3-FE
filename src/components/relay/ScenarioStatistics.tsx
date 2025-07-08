import { graphql } from "babel-plugin-relay/macro";
import { OverlayPanel } from "primereact/overlaypanel";
import { classNames } from "primereact/utils";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { GapDaysDisplay } from "./GapDaysDisplay";
import { UtilizationDisplay } from "./UtilizationDisplay";
import { type ScenarioStatistics_ScenarioFragment$key } from "../../__generated__/ScenarioStatistics_ScenarioFragment.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { TkButton } from "../ui/TkButton";

const FRAGMENT = graphql`
	fragment ScenarioStatistics_ScenarioFragment on Scenario {
		gapDays {
			...GapDaysDisplay_GapDaysFragment
		}
		utilization {
			...UtilizationDisplay_UtilizationFragment
		}
	}
`;

interface OwnProps {
	className?: string;
	scenarioFragmentRef: ScenarioStatistics_ScenarioFragment$key;
}

export const ScenarioStatistics = ({ className, scenarioFragmentRef }: OwnProps) => {
	const scenario = useFragment<ScenarioStatistics_ScenarioFragment$key>(
		FRAGMENT,
		scenarioFragmentRef,
	);
	const op = useRef<OverlayPanel>(null);
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	return (
		<div className={classNames(className)}>
			<TkButton
				className="p-1"
				icon="pi pi-chart-line"
				tooltip={"Scenario statistics"}
				onClick={(e) => op.current?.toggle(e)}
			/>

			<OverlayPanel ref={op} style={{ minWidth: 300 }}>
				<div className="flex flex-column">
					{gapDaysEnabled && (
						<GapDaysDisplay className="mb-2" gapDaysFragmentRef={scenario.gapDays} />
					)}
					<UtilizationDisplay utilizationFragmentRef={scenario.utilization} />
				</div>
			</OverlayPanel>
		</div>
	);
};
