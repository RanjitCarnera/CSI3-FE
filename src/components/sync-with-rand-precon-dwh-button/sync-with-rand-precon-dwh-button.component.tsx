import { Button } from "@thekeytechnology/framework-react-components";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	SCENARIO_FRAGMENT,
	SYNC_WITH_RAND_PRECON_DWH_MUTATION,
} from "@components/sync-with-rand-precon-dwh-button/sync-with-rand-precon-dwh-button.graphql";
import { type SyncWithRandPreconDwhButtonProps } from "@components/sync-with-rand-precon-dwh-button/sync-with-rand-precon-dwh-button.types";
import { selectCurrentAccountId } from "@redux/AuthSlice";
import { type syncWithRandPreconDwhButton_ScenarioFragment$key } from "@relay/syncWithRandPreconDwhButton_ScenarioFragment.graphql";
import { type syncWithRandPreconDwhButton_SyncWithRandPreconDwhMutation } from "@relay/syncWithRandPreconDwhButton_SyncWithRandPreconDwhMutation.graphql";
import { randPreconAccountId } from "@utils/account-ids";

export const SyncWithRandPreconDwhButton = ({
	scenarioFragmentRef,
}: SyncWithRandPreconDwhButtonProps) => {
	const scenario = useFragment<syncWithRandPreconDwhButton_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const [syncWithRandPreconDwhMutation, isSyncing] =
		useMutation<syncWithRandPreconDwhButton_SyncWithRandPreconDwhMutation>(
			SYNC_WITH_RAND_PRECON_DWH_MUTATION,
		);

	const currentAccountId = useSelector(selectCurrentAccountId);

	const isAccount = randPreconAccountId === currentAccountId;
	if (!isAccount) return null;
	if (!scenario.isMasterPlan) return null;
	return (
		<Button
			disabled={isSyncing}
			content={{ label: "Sync data" }}
			onClick={() => {
				syncWithRandPreconDwhMutation({
					variables: { input: {} },
					onCompleted: (res) => {
						toast.success("Synced successfully.");
						setTimeout(() => {
							window.location.reload();
						}, 2000);
					},
				});
			}}
		></Button>
	);
};
