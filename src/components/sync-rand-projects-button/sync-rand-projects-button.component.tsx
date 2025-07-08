import { Button, Dialog } from "@thekeytechnology/framework-react-components";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { FromRandIcon } from "@components/from-rand-icon";
import { RAND_SYNC_FIELDS } from "@components/rand-sync-fields-select/rand-sync-fields-select.const";
import { SYNC_RAND_PROJECTS_MUTATION } from "@components/sync-rand-projects-button/sync-rand-projects-button.graphql";
import {
	type SyncRandProjectsButtonProps,
	type SyncResult,
} from "@components/sync-rand-projects-button/sync-rand-projects-button.types";
import {
	SyncRandProjectsForm,
	type SyncRandProjectsFormState,
} from "@components/sync-rand-projects-form";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButton } from "@components/ui/TkButton";
import { TkMessage } from "@components/ui/TkMessage";
import { selectCurrentAccountId } from "@redux/AuthSlice";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	type RandSyncFields,
	type syncRandProjectsButton_SyncProjectsFromRandMutation,
} from "@relay/syncRandProjectsButton_SyncProjectsFromRandMutation.graphql";

export const SyncRandProjectsButton = ({
	projectIds,
	onCompleted,
}: SyncRandProjectsButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [sync, isSyncing] = useMutation<syncRandProjectsButton_SyncProjectsFromRandMutation>(
		SYNC_RAND_PROJECTS_MUTATION,
	);

	const [syncResult, setSyncResult] = useState<SyncResult | undefined>(undefined);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Rand_DataWarehouseIntegration",
	]);

	const projectsAmountString = useMemo(
		() => (projectIds.length > 0 ? projectIds.length + "" : ""),
		[projectIds],
	);
	const currentAccountId = useSelector(selectCurrentAccountId);
	const isAccount = [
		"Account:0377a1e0-45b6-46bf-a245-3457b0ece116",
		"Account:9c40380a-8875-4ce8-8360-bf0c24860378",
	].includes(currentAccountId ?? "");

	const handleHideOnClick = () => {
		setVisible(false);
		setSyncResult(undefined);
	};
	return hasPermission && isAccount ? (
		<div>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={`Load ${projectsAmountString} project${
					projectsAmountString ? "(s)" : "s"
				} from rand`}
				disabled={!projectIds || projectIds.length === 0 || isSyncing}
				icon={<FromRandIcon />}
				iconPos="left"
			/>

			{!syncResult ? (
				<SuspenseDialogWithState<SyncRandProjectsFormState>
					title={`Load ${projectsAmountString} project${
						projectsAmountString ? "(s)" : "s"
					} from rand`}
					isVisible={isVisible}
					onHide={() => {
						setVisible(false);
					}}
					affirmativeText={!syncResult ? "Sync" : "Sync result"}
					formComponent={(ref, onHide) => {
						return (
							<SyncRandProjectsForm
								ref={ref}
								onSubmit={(values, { setSubmitting }) => {
									const selectedSyncFields = values.randSyncFields.map(
										(value) => {
											const entry = Object.entries(RAND_SYNC_FIELDS).find(
												([_, fieldValue]) => value === fieldValue,
											);
											return entry?.[0];
										},
									) as RandSyncFields[];

									sync({
										variables: {
											input: {
												randSyncFields: selectedSyncFields,
												projectIds,
											},
										},
										onCompleted: (response) => {
											const syncResultOpt =
												response.Rand.synchronizeProjectsFromRand
													?.syncResult;
											if (syncResultOpt)
												setSyncResult(syncResultOpt as SyncResult);
											setSubmitting(false);
											onCompleted();
										},
									});
								}}
							/>
						);
					}}
				/>
			) : (
				<Dialog title={"Sync result"} onHide={handleHideOnClick} visible={isVisible}>
					<h4>
						{syncResult.editedEntities > 0
							? "Project data has been loaded from rand and synced!"
							: "Project data has not been synced correctly."}
					</h4>
					<TkMessage
						className="mb-3 w-12"
						content={
							<div>
								<div>
									<strong>{syncResult.editedEntities}</strong> synced.
								</div>
								{syncResult.issues.length > 0 && (
									<div>
										<h4>Sync issues</h4>
										{syncResult.issues.map((issue) => (
											<div>
												<strong>{issue.id}: </strong>
												{issue.issue}
											</div>
										))}
									</div>
								)}
							</div>
						}
					/>
					<Button content={{ label: "Close" }} onClick={handleHideOnClick} />
				</Dialog>
			)}
		</div>
	) : null;
};
