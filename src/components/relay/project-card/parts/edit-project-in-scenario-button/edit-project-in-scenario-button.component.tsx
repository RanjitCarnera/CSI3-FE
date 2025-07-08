import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import {
	EDIT_PROJECT_IN_SCENARIO_MUTATION,
	PROJECT_FRAGMENT,
} from "@components/relay/project-card/parts/edit-project-in-scenario-button/edit-project-in-scenario-button.graphql";
import { projectToState } from "@components/relay/sync-project-from-dynamics-button";
import { EditProjectForm, type EditProjectFormState } from "@components/ui/edit-project-form";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editProjectInScenarioButton_editProjectInScenarioMutation } from "@relay/editProjectInScenarioButton_editProjectInScenarioMutation.graphql";
import { type editProjectInScenarioButton_ProjectFragment$key } from "@relay/editProjectInScenarioButton_ProjectFragment.graphql";

export const EditProjectInScenarioButton = ({
	className,
	hideLabel,
	scenarioId,
	projectFragmentRef,
}: {
	className?: string;
	hideLabel: boolean;
	scenarioId: string;
	projectFragmentRef: editProjectInScenarioButton_ProjectFragment$key;
}) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions(["UserInAccountPermission_Project_Edit"]);

	const [edit] = useMutation<editProjectInScenarioButton_editProjectInScenarioMutation>(
		EDIT_PROJECT_IN_SCENARIO_MUTATION,
	);

	const [isVisible, setVisible] = useState(false);
	const project = useFragment<editProjectInScenarioButton_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	return hasPermission ? (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label={hideLabel ? "" : "Edit"}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<EditProjectFormState>
				title={"Create project"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<EditProjectForm
							initialState={projectToState(project)}
							ref={ref}
							onSubmit={(values) => {
								edit({
									variables: {
										input: {
											scenarioId,
											projectId: project.id,
											data: {
												name: values.name!,
												address: values.address,
												architectName: values.architectName,
												clientName: values.clientName,
												stageId: values.stageRef!,
												volume: values.volume,
												generalConditionsPercentage:
													values.generalConditionsPercentage,
												startDate: values.startDate!,
												endDate: values.endDate!,
												divisionId: values.divisionRef,
												regionId: values.regionRef,
												projectIdentifier: values.projectIdentifier,
												avatarId: values.avatarRef,
												skillsIds: values.skillsRef || [],
												comments: values.comments,
												budgetedLaborCosts: values.budgetedLaborCosts,
											},
											milestoneCreationData: {
												creationData:
													values.milestones?.map((e) => ({
														projectId: project.id,
														milestoneData: {
															date: e.date,
															name: e.name,
														},
														milestoneIdOpt: e.id ? e.id : null,
													})) ?? [],
												milestoneIds: [],
											},
											moveAssignmentStartDates:
												values.moveAssigmentStartDates || false,
											moveAssignmentEndDates:
												values.moveAssigmentEndDates || false,
										},
									},
									onCompleted: () => {
										ref.current?.setSubmitting(false);
										onHide();
									},
									onError: () => {
										ref.current?.setSubmitting(false);
									},
								});
							}}
						/>
					);
				}}
			/>
		</>
	) : null;
};
