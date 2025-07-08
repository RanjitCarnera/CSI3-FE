import { Button, Dialog } from "@thekeytechnology/framework-react-components";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { type LoadPursuitProjectsFromRandDwhButtonProps } from "@components/load-pursuit-projects-from-rand-dwh-button/load-pursuit-projects-from-rand-dwh-button.types";
import type { SyncResult } from "@components/sync-rand-projects-button/sync-rand-projects-button.types";
import { TkMessage } from "@components/ui/TkMessage";
import { selectCurrentAccountId } from "@redux/AuthSlice";
import { type loadPursuitProjectsFromRandDwhButton_loadPursuitProjectsFromDWHMutation } from "@relay/loadPursuitProjectsFromRandDwhButton_loadPursuitProjectsFromDWHMutation.graphql";
import { type loadPursuitProjectsFromRandDwhButton_ScenarioFragment$key } from "@relay/loadPursuitProjectsFromRandDwhButton_ScenarioFragment.graphql";
import { randAccountId } from "@utils/account-ids";
import {
	LOAD_PURSUIT_PROJECTS_FROM_DWH_MUTATION,
	SCENARIO_FRAGMENT,
} from "./load-pursuit-projects-from-rand-dwh-button.graphql";

export const LoadPursuitProjectsFromRandDwhButton = ({
	scenarioFragmentRef,
}: LoadPursuitProjectsFromRandDwhButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [syncResult, setSyncResult] = useState<SyncResult | undefined>(undefined);

	const scenario = useFragment<loadPursuitProjectsFromRandDwhButton_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);

	const [commit, isInFlight] =
		useMutation<loadPursuitProjectsFromRandDwhButton_loadPursuitProjectsFromDWHMutation>(
			LOAD_PURSUIT_PROJECTS_FROM_DWH_MUTATION,
		);

	const currentAccountId = useSelector(selectCurrentAccountId);

	const isAccount = randAccountId === currentAccountId;
	if (!isAccount) return null;
	if (!scenario.isMasterPlan) return null;

	const handleOnClick = () => {
		commit({
			variables: { input: {} },
			onCompleted: (response) => {
				if (
					![...(response.Rand.loadPursuitProjectsFromDWH?.syncResult?.issues ?? [])]
						.length
				) {
					toast.success("Loaded pursuits successfully");
					setTimeout(() => {
						window.location.reload();
					}, 2000);
					return;
				}
				setVisible(true);
				setSyncResult(response.Rand?.loadPursuitProjectsFromDWH?.syncResult as SyncResult);
			},
		});
	};

	const handleHideOnClick = () => {
		setVisible(false);
	};
	const handleReloadOnClick = () => {
		window.location.reload();
	};
	return (
		<>
			<Button
				content={{ label: "Load pursuits" }}
				onClick={handleOnClick}
				disabled={isInFlight}
			/>
			{!syncResult ? null : (
				<Dialog title={"Sync result"} onHide={handleHideOnClick} visible={isVisible}>
					<h4>
						{syncResult.editedEntities > 0
							? "Pursuit projects have been loaded from rand dwh!"
							: "Pursuits projects have not been all been imported."}
					</h4>
					<TkMessage
						className="mb-3 w-12"
						content={
							<div>
								<div>
									<strong>{syncResult.editedEntities}</strong> imported.
								</div>
								{syncResult.issues.length > 0 && (
									<div>
										<h4>Import issues</h4>
										{syncResult.issues.map((issue) => (
											<div key={issue.id}>
												<strong>{issue.id}: </strong>
												{issue.issue}
											</div>
										))}
									</div>
								)}
							</div>
						}
					/>
					{syncResult.editedEntities ? (
						<Button content={{ label: "Reload" }} onClick={handleReloadOnClick} />
					) : null}
				</Dialog>
			)}
		</>
	);
};
