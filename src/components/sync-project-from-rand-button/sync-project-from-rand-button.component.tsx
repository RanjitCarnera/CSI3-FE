import React, { useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useMutation } from "react-relay";
import { FromRandIcon } from "@components/from-rand-icon";
import { type SyncProjectFromRandButtonProps } from "@components/sync-project-from-rand-button/sync-project-from-rand-button.interface";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editProjectButton_ProjectFragment$data } from "@relay/editProjectButton_ProjectFragment.graphql";
import { type syncProjectFromRandButton_EditMutation } from "@relay/syncProjectFromRandButton_EditMutation.graphql";
import {
	type syncProjectFromRandButton_ProjectFragment$data,
	type syncProjectFromRandButton_ProjectFragment$key,
} from "@relay/syncProjectFromRandButton_ProjectFragment.graphql";
import { type syncProjectFromRandButton_SyncFromRandMutation } from "@relay/syncProjectFromRandButton_SyncFromRandMutation.graphql";
import {
	type syncProjectFromRandButton_SyncProjectFragment$data,
	type syncProjectFromRandButton_SyncProjectFragment$key,
} from "@relay/syncProjectFromRandButton_SyncProjectFragment.graphql";
import {
	EDIT_MUTATION,
	PROJECT_FRAGMENT,
	PROJECT_SYNC_FRAGMENT,
	SYNC_MUTATION,
} from "./sync-project-from-rand-button.graphql";

import {
	EditProjectForm,
	type EditProjectFormState,
	type Milestone,
} from "../ui/edit-project-form";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../ui/TkButtonLink";

export const SyncProjectFromRandButton = ({
	projectId,
	className,
	projectFragmentRef,
}: SyncProjectFromRandButtonProps) => {
	const project = useFragment<syncProjectFromRandButton_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	const [sync, isSyncing] =
		useMutation<syncProjectFromRandButton_SyncFromRandMutation>(SYNC_MUTATION);
	const [edit, isEditing] = useMutation<syncProjectFromRandButton_EditMutation>(EDIT_MUTATION);

	const [syncProject, setSyncProject] =
		useState<syncProjectFromRandButton_SyncProjectFragment$data>();
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Rand_DataWarehouseIntegration",
	]);

	return hasPermission ? (
		<>
			<TkButtonLink
				className={className}
				icon={<FromRandIcon />}
				iconPos="left"
				tooltip="Sync from Rand"
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
								readInlineData<syncProjectFromRandButton_SyncProjectFragment$key>(
									PROJECT_SYNC_FRAGMENT,
									e.Rand.loadProjectDataFromRand?.edge.node!,
								),
							);
						},
					})
				}
			/>

			<SuspenseDialogWithState<EditProjectFormState>
				isVisible={!!syncProject}
				title={"Sync from Rand"}
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
												skillsIds: values.skillsRef ?? [],
												comments: values.comments,
												budgetedLaborCosts: values.budgetedLaborCosts,
											},
											milestoneCreationData: {
												creationData: [],
												milestoneIds: [],
											},
											moveAssignmentEndDates:
												values.moveAssigmentEndDates ?? false,
											moveAssignmentStartDates:
												values.moveAssigmentStartDates ?? false,
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
		| syncProjectFromRandButton_ProjectFragment$data
		| syncProjectFromRandButton_SyncProjectFragment$data
		| editProjectButton_ProjectFragment$data
		| undefined,
): EditProjectFormState => {
	return {
		name: project?.name,
		address: project?.address ?? undefined,
		startDate: project?.startDate,
		endDate: project?.endDate,
		architectName: project?.architectName ?? undefined,
		clientName: project?.clientName ?? undefined,
		stageRef: project?.stage?.id,
		volume: project?.volume ?? undefined,
		generalConditionsPercentage: project?.generalConditionsPercentage ?? undefined,
		divisionRef: project?.division?.id ?? undefined,
		regionRef: project?.region?.id ?? undefined,
		projectIdentifier: project?.projectIdentifier ?? "",
		avatarRef: project?.avatar?.id ?? undefined,
		milestones:
			project?.milestones.map(
				(e) =>
					({
						name: e.data.name,
						date: e.data.date,
						id: e.id,
					}) as Milestone,
			) ?? undefined,
		skillsRef: project?.skills?.map((e) => e.id) ?? undefined,
		comments: project?.comments ?? undefined,
		budgetedLaborCosts: project?.budgetedLaborCosts ?? undefined,
		source: project?.source,
	};
};
