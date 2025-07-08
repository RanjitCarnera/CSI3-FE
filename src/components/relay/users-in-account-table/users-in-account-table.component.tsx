import { Column } from "primereact/column";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { usersInAccountTable_Query } from "@relay/usersInAccountTable_Query.graphql";
import { TkDataTable } from "../../ui/TkDataTable";
import { RemoveUserFromAccountButton } from "../RemoveUserFromAccountButton";
import { usersInAccountTable_Refetch } from "@relay/usersInAccountTable_Refetch.graphql";
import { usersInAccountTable_UsersInAccountListFragment$key } from "@relay/usersInAccountTable_UsersInAccountListFragment.graphql";
import { ChangeUserInAccountGroupsButton } from "@components/relay/change-user-in-account-groups-button";
import { Button } from "primereact/button";
import {
	USERS_IN_ACCOUNT_TABLE_LIST_FRAGMENT,
	USERS_IN_ACCOUNT_TABLE_QUERY,
} from "@components/relay/users-in-account-table/users-in-account-table.graphql";
import { filterGroups } from "@components/relay/change-user-in-account-groups-modal/change-user-in-account-groups-modal.util";

export const UsersInAccountTable = () => {
	const data = useLazyLoadQuery<usersInAccountTable_Query>(USERS_IN_ACCOUNT_TABLE_QUERY, {
		first: 20,
	});
	const {
		hasNext,
		loadNext,
		data: {
			Management: {
				UsersInAccount: { __id, edges: users },
			},
		},
	} = usePaginationFragment<
		usersInAccountTable_Refetch,
		usersInAccountTable_UsersInAccountListFragment$key
	>(USERS_IN_ACCOUNT_TABLE_LIST_FRAGMENT, data);

	return (
		<>
			<h3>Users in account</h3>

			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no users in your account yet.</div>
					</div>
				}
				className="mb-3"
				value={users?.map((b) => b!.node!) as any[]}
			>
				<Column
					header="Name"
					sortable
					sortField={"user.name"}
					body={(row) => {
						return row.user.name;
					}}
				/>
				<Column
					header="Email"
					sortable
					sortField={"user.email"}
					body={(row) => {
						return row.user.email;
					}}
				/>
				<Column
					header="Groups"
					sortable
					sortField={"groups.0.name"}
					body={(row) => {
						return (
							<div className="flex align-items-center">
								<div>
									{filterGroups(row.groups)
										.map((g: any) => g.name)
										.join(", ")}
								</div>
								<ChangeUserInAccountGroupsButton userInAccountFragment={row} />
							</div>
						);
					}}
				/>
				<Column
					header="Actions"
					body={(row) => {
						return (
							<div>
								<RemoveUserFromAccountButton
									userId={row.user.id}
									connectionId={__id}
								/>
							</div>
						);
					}}
				/>
			</TkDataTable>

			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<Button
						type="button"
						className="p-button-secondary"
						disabled={!hasNext}
						onClick={() => loadNext(20)}
					>
						Load more
					</Button>
				</div>
			)}
		</>
	);
};
