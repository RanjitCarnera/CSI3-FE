import React, { useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useMutation } from "react-relay";
import type { editProjectInScenarioButton_ProjectFragment$data } from "@relay/editProjectInScenarioButton_ProjectFragment.graphql";
import {
	EDIT_MUTATION,
	PROJECT_FRAGMENT,
	PROJECT_SYNC_FRAGMENT,
	SYNC_MUTATION,
} from "./sync-project-from-dynamics-button.graphql";
import { type SyncProjectFromDynamicsButtonProps } from "./sync-project-from-dynamics-button.interface";
import { type editProjectButton_ProjectFragment$data } from "../../../__generated__/editProjectButton_ProjectFragment.graphql";
import { type syncProjectFromDynamicsButton_EditMutation } from "../../../__generated__/syncProjectFromDynamicsButton_EditMutation.graphql";
import {
	type syncProjectFromDynamicsButton_ProjectFragment$data,
	type syncProjectFromDynamicsButton_ProjectFragment$key,
} from "../../../__generated__/syncProjectFromDynamicsButton_ProjectFragment.graphql";
import { type syncProjectFromDynamicsButton_SyncFromDynamicsMutation } from "../../../__generated__/syncProjectFromDynamicsButton_SyncFromDynamicsMutation.graphql";
import {
	type syncProjectFromDynamicsButton_SyncProjectFragment$data,
	type syncProjectFromDynamicsButton_SyncProjectFragment$key,
} from "../../../__generated__/syncProjectFromDynamicsButton_SyncProjectFragment.graphql";
import DynamicsIcon from "../../../assets/dynamics-icon.png";
import { selectHasPermissions } from "../../../redux/CurrentUserSlice";
import {
	EditProjectForm,
	type EditProjectFormState,
	type Milestone,
} from "../../ui/edit-project-form";
import { SuspenseDialogWithState } from "../../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../../ui/TkButtonLink";

export const SyncProjectFromDynamicsButton = ({
	projectId,
	className,
	projectFragmentRef,
}: SyncProjectFromDynamicsButtonProps) => {
	const project = useFragment<syncProjectFromDynamicsButton_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	const [sync, isSyncing] =
		useMutation<syncProjectFromDynamicsButton_SyncFromDynamicsMutation>(SYNC_MUTATION);
	const [edit, isEditing] =
		useMutation<syncProjectFromDynamicsButton_EditMutation>(EDIT_MUTATION);

	const [syncProject, setSyncProject] =
		useState<syncProjectFromDynamicsButton_SyncProjectFragment$data>();

	const hasPermissions = useSelector(selectHasPermissions);

	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Auth_Field",
	]);
	return hasPermission ? (
		<>
			<TkButtonLink
				className={className}
				icon={<img alt="dynamics" src={DynamicsIcon} height={16} width={16} />}
				iconPos="left"
				tooltip="Sync from Dynamics"
				label={isSyncing ? "Syncing..." : "Sync"}
				disabled={isSyncing || isEditing}
				onClick={() =>
					sync({
						variables: {
							input: {
								projectId,
							},
						},
						onCompleted: (e) => {
							setSyncProject(
								readInlineData<syncProjectFromDynamicsButton_SyncProjectFragment$key>(
									PROJECT_SYNC_FRAGMENT,
									e.Dynamics.loadProjectDataFromDynamics?.edge.node!,
								),
							);
						},
					})
				}
			/>

			<SuspenseDialogWithState<EditProjectFormState>
				isVisible={!!syncProject}
				title={"Sync from Dynamics"}
				affirmativeText={"Overwrite"}
				formComponent={(ref, onHide) => {
					return (
						<EditProjectForm
							ref={ref}
							initialState={projectToState(project)}
							comparisonProjectState={projectToState(syncProject)}
							onSubmit={(values, { setSubmitting }) => {
								edit({
									variables: {
										input: {
											projectId: project.id,
											data: {
												name: values.name!,
												address: values.address,
												architectName: values.architectName,
												clientName: values.clientName,
												stageId: values.stageRef!,
												volume: values.volume,
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
												milestoneIds: [],
												creationData: [],
											},
											moveAssignmentEndDates:
												values.moveAssigmentEndDates || false,
											moveAssignmentStartDates:
												values.moveAssigmentStartDates || false,
										},
									},
									onCompleted: () => {
										setSyncProject(undefined);
										setSubmitting(false);
										onHide();
									},
								});
							}}
						/>
					);
				}}
				onHide={() => {
					setSyncProject(undefined);
				}}
			/>
		</>
	) : null;
};

export const projectToState = (
	project:
		| syncProjectFromDynamicsButton_ProjectFragment$data
		| syncProjectFromDynamicsButton_SyncProjectFragment$data
		| editProjectInScenarioButton_ProjectFragment$data
		| editProjectButton_ProjectFragment$data
		| undefined,
): EditProjectFormState => {
	return {
		name: project?.name,
		address: project?.address || undefined,
		startDate: project?.startDate,
		endDate: project?.endDate,
		architectName: project?.architectName || undefined,
		clientName: project?.clientName || undefined,
		stageRef: project?.stage?.id,
		volume: project?.volume || undefined,
		generalConditionsPercentage: project?.generalConditionsPercentage || undefined,
		divisionRef: project?.division?.id || undefined,
		regionRef: project?.region?.id || undefined,
		projectIdentifier: project?.projectIdentifier || "",
		avatarRef: project?.avatar?.id || undefined,
		milestones:
			project?.milestones.map(
				(e) =>
					({
						id: e.id,
						name: e.data.name,
						date: e.data.date,
					}) as Milestone,
			) || undefined,
		skillsRef: project?.skills?.map((e) => e.id) || undefined,
		comments: project?.comments ?? undefined,
		budgetedLaborCosts: project?.budgetedLaborCosts ?? undefined,
	};
};
