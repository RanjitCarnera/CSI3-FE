import { BaseSettingsScreen } from "../../components/ui/BaseSettingsScreen";
import { TkCard } from "../../components/ui/TkCard";
import { Suspense } from "react";
import { TkTableSkeleton } from "../../components/ui/TkTableSkeleton";
import { AccountsAdminTable } from "../../components/relay/AccountsAdminTable";

export const AccountsAdminScreen = () => {
	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Accounts (Admin View)</h1>
					</div>
				}
			>
				<Suspense
					fallback={
						<TkTableSkeleton columnNames={["Name", "Registered at", "Actions"]} />
					}
				>
					<AccountsAdminTable />
				</Suspense>
			</TkCard>
		</BaseSettingsScreen>
	);
};
