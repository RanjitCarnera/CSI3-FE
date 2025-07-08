import { Button } from "@thekeytechnology/framework-react-components";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { REMOVE_PROJECT_FROM_SCENARIO_MUTATION } from "@components/relay/project-card/parts/remove-project-from-scenario-button/remove-project-from-scenario-button.graphql";
import { type RemoveProjectFromScenarioButtonProps } from "@components/relay/project-card/parts/remove-project-from-scenario-button/remove-project-from-scenario-button.types";
import { useDialogLogic } from "@components/ui/useDialogLogic";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type removeProjectFromScenarioButton_RemoveProjectFromScenarioMutation } from "@relay/removeProjectFromScenarioButton_RemoveProjectFromScenarioMutation.graphql";
import { useProjectViewFilters } from "@screens/project-view/project-view.utils";

export const RemoveProjectFromScenarioButton = ({
	scenarioId,
	projectId,
}: RemoveProjectFromScenarioButtonProps) => {
	const [remove, isRemoving] =
		useMutation<removeProjectFromScenarioButton_RemoveProjectFromScenarioMutation>(
			REMOVE_PROJECT_FROM_SCENARIO_MUTATION,
		);

	const { dialogComponent, showDialog } = useDialogLogic();
	const hasPermissions = useSelector(selectHasPermissions);
	const hasProjectEditPermissions = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"UserInAccountPermission_Scenario_Edit",
	]);

	const projectViewFilters = useProjectViewFilters();
	if (!hasProjectEditPermissions) return <Fragment />;

	return (
		<>
			<Button
				inputVariant={"subtle"}
				content={{ icon: "pi pi-trash" }}
				disabled={isRemoving}
				onClick={() => {
					showDialog({
						title: `Remove project from scenario`,
						content:
							"Do you really want to remove this project? This cannot be undone. All assignments in this scenario are deleted.",
						affirmativeText: "Delete",
						negativeText: "Cancel",
						dialogCallback: (result) => {
							if (result === "Accept") {
								remove({
									variables: {
										input: {
											scenarioId,
											projectId,
										},
										projectFilters: projectViewFilters.projectFilters,
										personOnAssignmentFilters:
											projectViewFilters.personOnAssignmentFilters,
									},
								});
							}
						},
					});
				}}
			/>
			{dialogComponent}
		</>
	);
};
