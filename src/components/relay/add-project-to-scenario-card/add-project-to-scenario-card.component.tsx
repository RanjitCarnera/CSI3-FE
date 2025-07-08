import { useState } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type addProjectToScenarioCard_ScenarioFragment$key } from "@relay/addProjectToScenarioCard_ScenarioFragment.graphql";
import { type AddProjectToScenarioCardProps } from "./add-project-to-scenario-card.interface";
import { SCENARIO_FRAGMENT } from "./parts/add-project-to-scenario-card.graphql";
import { AddProjectsToScenarioModal } from "./parts/add-project-to-scenario-modal/add-project-to-scenario-modal.component";
import { ProjectCardBase } from "../project-card/project-card.component";

export const AddProjectToScenarioCard = ({
	scenarioFragmentRef,
}: AddProjectToScenarioCardProps) => {
	const scenario = useFragment<addProjectToScenarioCard_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const [isVisible, setVisible] = useState<boolean>(false);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasMasterplanEditPermission = hasPermissions([
		"UserInAccountPermission_Scenario_Masterplan",
	]);
	const hasEditPermissions = hasPermissions(["UserInAccountPermission_Scenario_Edit"]);

	const canAdd =
		hasEditPermissions &&
		(!scenario.isMasterPlan || (scenario.isMasterPlan && hasMasterplanEditPermission));

	return canAdd ? (
		<>
			<ProjectCardBase
				className="cursor-pointer hide-print"
				onClick={() => {
					setVisible(true);
				}}
			>
				<div className="flex justify-content-center align-items-center mt-6">
					+ Add project to scenario
				</div>
			</ProjectCardBase>
			<AddProjectsToScenarioModal
				scenarioFragmentRef={scenario}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
			/>
		</>
	) : null;
};
