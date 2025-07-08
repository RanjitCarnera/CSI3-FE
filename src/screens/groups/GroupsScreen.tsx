import { BaseSettingsScreen } from "@components/ui/BaseSettingsScreen";
import { TkCard } from "@components/ui/TkCard";
import { Suspense } from "react";
import { TkTableSkeleton } from "@components/ui/TkTableSkeleton";
import { UserInAccountGroupsTable } from "@components/relay/user-in-account-groups-table/user-in-account-groups-table.component";

export const GroupsScreen = () => {
	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Groups</h1>
					</div>
				}
			>
				<Suspense fallback={<TkTableSkeleton columnNames={["Name", "Actions"]} />}>
					<UserInAccountGroupsTable />
				</Suspense>
			</TkCard>
		</BaseSettingsScreen>
	);
};
