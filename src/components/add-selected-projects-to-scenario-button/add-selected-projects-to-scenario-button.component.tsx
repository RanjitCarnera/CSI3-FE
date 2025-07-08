import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import React from "react";
import { useMutation } from "react-relay";
import { ADD_EXISTING_PROJECTS_TO_SCENARIO_MUTATION } from "@components/add-selected-projects-to-scenario-button/add-selected-projects-to-scenario-button.graphql";
import {
	type AddSelectedProjectsToScenarioButtonFormState,
	type AddSelectedProjectsToScenarioButtonProps,
} from "@components/add-selected-projects-to-scenario-button/add-selected-projects-to-scenario-button.types";
import { type addSelectedProjectsToScenarioButton_AddExistingProjectsToScenarioMutation } from "@relay/addSelectedProjectsToScenarioButton_AddExistingProjectsToScenarioMutation.graphql";
import { Form } from "./parts/form";

export const AddSelectedProjectsToScenarioButton = ({
	selectedProjectIds,
}: AddSelectedProjectsToScenarioButtonProps) => {
	const hasNoProjects = selectedProjectIds.length === 0;
	const [add, isAdding] =
		useMutation<addSelectedProjectsToScenarioButton_AddExistingProjectsToScenarioMutation>(
			ADD_EXISTING_PROJECTS_TO_SCENARIO_MUTATION,
		);

	const createOnSubmitHandler = (
		values: AddSelectedProjectsToScenarioButtonFormState,
		onHide: () => void,
	) => {
		add({
			variables: {
				input: {
					scenarioId: values.scenarioId,
					projectIds: selectedProjectIds,
				},
			},
			onCompleted: () => {
				onHide();
			},
		});
	};
	const title = `Add selected ${selectedProjectIds.length} project${
		selectedProjectIds.length > 1 ? "s" : ""
	} to scenario`;
	return (
		<FormDialogButton<{ scenarioId: string }>
			title={title}
			buttonContent={{
				label: `Add selection to scenario`,
			}}
			disabled={hasNoProjects || isAdding}
		>
			{(ref, onHide) => {
				return (
					<>
						<Form
							ref={ref}
							initialState={{ scenarioId: "" }}
							onSubmit={(values) => {
								createOnSubmitHandler(values, onHide);
							}}
						/>
					</>
				);
			}}
		</FormDialogButton>
	);
};
