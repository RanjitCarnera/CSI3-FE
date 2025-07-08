import { BaseSettingsScreen } from "../../components/ui/BaseSettingsScreen";
import { TkCard } from "../../components/ui/TkCard";
import { Suspense } from "react";
import { TkTableSkeleton } from "../../components/ui/TkTableSkeleton";
import { UsersInAccountTable } from "@components/relay/users-in-account-table/users-in-account-table.component";
import { InvitationsTable } from "../../components/relay/InvitationsTable";

export const AccessScreen = () => {
	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Access</h1>
					</div>
				}
			>
				<Suspense fallback={<TkTableSkeleton columnNames={["Name", "Actions"]} />}>
					<InvitationsTable />
					<UsersInAccountTable />
				</Suspense>
			</TkCard>
		</BaseSettingsScreen>
	);
};
