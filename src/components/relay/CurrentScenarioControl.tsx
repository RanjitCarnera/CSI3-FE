import { graphql } from "babel-plugin-relay/macro";
import { TabPanel } from "primereact/tabview";
import { Suspense, useState } from "react";
import { useFragment } from "react-relay";
import styled from "styled-components";
import { SkeletonUserScenariosTable, UserUserScenariosTable } from "./UserScenariosTable";
import { type CurrentScenarioControl_ScenarioFragment$key } from "../../__generated__/CurrentScenarioControl_ScenarioFragment.graphql";
import { TkButton } from "../ui/TkButton";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { TkTabView } from "../ui/TkTabView";

const SCENARIO_FRAGMENT = graphql`
	fragment CurrentScenarioControl_ScenarioFragment on Scenario {
		id
		name
		isMasterPlan
	}
`;

interface OwnProps {
	className?: string;
	scenarioFragmentRef: CurrentScenarioControl_ScenarioFragment$key;
}

export const CurrentScenarioControl = ({ className, scenarioFragmentRef }: OwnProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const scenario = useFragment<CurrentScenarioControl_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);

	return (
		<div className={className}>
			<SelectInput
				icon={"pi pi-chevron-right"}
				iconPos={"right"}
				label={scenario.name + (scenario.isMasterPlan ? " (Master Plan)" : "")}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<TkDialog
				dismissableMask={true}
				showHeader={false}
				onHide={() => {
					setVisible(false);
				}}
				visible={isVisible}
				footer={
					<div className="flex justify-content-center">
						<TkButtonLink
							label={"Close"}
							onClick={() => {
								setVisible(false);
							}}
						/>
					</div>
				}
			>
				<div className="pt-5">
					<TkTabView
						activeIndex={activeIndex}
						onTabChange={(e) => {
							setActiveIndex(e.index);
						}}
					>
						<TabPanel header="My Scenarios">
							<Suspense fallback={<SkeletonUserScenariosTable />}>
								<UserUserScenariosTable
									scenarioId={scenario.id}
									onlyShowMine={true}
								/>
							</Suspense>
						</TabPanel>
						<TabPanel header="Other user's Scenarios">
							<Suspense fallback={<SkeletonUserScenariosTable />}>
								<UserUserScenariosTable
									scenarioId={scenario.id}
									onlyShowMine={false}
								/>
							</Suspense>
						</TabPanel>
					</TkTabView>
				</div>
			</TkDialog>
		</div>
	);
};

const SelectInput = styled(TkButton)`
	min-width: 250px;
	color: #7d85a7 !important;
	border: 1px solid #eff1fb;
	display: flex;
	box-shadow: none;
	justify-content: space-between;
	background-color: transparent;
	text-align: left;
	font-size: 0.8rem;

	&:hover {
		color: #7d85a7 !important;
		border: 1px solid #eff1fb !important;
		background-color: transparent !important;
	}
`;
