import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { DYNAMICS_SYNC_FIELDS } from "@components/relay/dynamics-sync-fields-select/dynamics-sync-fields-select.const";
import { SYNC_DYNAMICS_PROJECTS_MUTATION } from "@components/relay/sync-dynamics-projects-button/sync-dynamics-projects-button.graphql";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	type DynamicsSyncFields,
	type syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation,
} from "@relay/syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation.graphql";
import { type SyncProjectsButtonProps } from "./sync-dynamics-projects-button.interface";
import DynamicsIcon from "../../../assets/dynamics-icon.png";
import { SuspenseDialogWithState } from "../../ui/SuspenseDialogWithState";
import { TkButton } from "../../ui/TkButton";
import {
	SyncDynamicsProjectsForm,
	type SyncDynamicsProjectsFormState,
} from "../sync-dynamics-projects-form";

export const SyncDynamicsProjectsButton = ({ projectIds }: SyncProjectsButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [sync, isSyncing] =
		useMutation<syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation>(
			SYNC_DYNAMICS_PROJECTS_MUTATION,
		);

	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Auth_Field",
	]);

	const projectsAmountString = projectIds.length > 0 ? projectIds.length + "" : "";
	return hasPermission ? (
		<div>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={`Load ${projectsAmountString} project${
					projectsAmountString ? "(s)" : "s"
				} from dynamics`}
				disabled={!projectIds || projectIds.length === 0 || isSyncing}
				icon={<img alt="dynamics" src={DynamicsIcon} height={16} width={16} />}
				iconPos="left"
			/>

			<SuspenseDialogWithState<SyncDynamicsProjectsFormState>
				title={`Load ${projectsAmountString} project${
					projectsAmountString ? "(s)" : "s"
				} from dynamics`}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				affirmativeText={"Sync"}
				formComponent={(ref, onHide) => {
					return (
						<SyncDynamicsProjectsForm
							ref={ref}
							onSubmit={(values, { setSubmitting }) => {
								const selectedSyncFields = values.dynamicsSyncFields.map(
									(value) => {
										const entry = Object.entries(DYNAMICS_SYNC_FIELDS).find(
											([_, fieldValue]) => value === fieldValue,
										);
										return entry?.[0];
									},
								) as DynamicsSyncFields[];

								sync({
									variables: {
										input: {
											dynamicsSyncFields: selectedSyncFields,
											projectIds,
										},
									},
									onCompleted: () => {
										setSubmitting(false);
										toast.success(
											"Project data has been loaded from dynamics!",
										);
										onHide();
									},
								});
							}}
						/>
					);
				}}
			/>
		</div>
	) : null;
};
