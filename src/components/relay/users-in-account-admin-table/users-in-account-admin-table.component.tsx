import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { usersInAccountAdminTable_Query } from "@relay/usersInAccountAdminTable_Query.graphql";
import { usersInAccountAdminTable_UsersInAccountListFragment$key } from "@relay/usersInAccountAdminTable_UsersInAccountListFragment.graphql";
import { Column } from "primereact/column";
import { TkButton } from "../../ui/TkButton";
import { TkDataTable } from "../../ui/TkDataTable";
import { ChangeUserGroupsAdminButton } from "../ChangeUserGroupsAdminButton";
import { RemoveUserFromAccountAdminButton } from "../RemoveUserFromAccountAdminButton";
import { CreateUserInAccountButton } from "../CreateUserInAccountButton";
import {
	usersInAccountAdminTable_UserInlineFragment$data,
	usersInAccountAdminTable_UserInlineFragment$key,
} from "@relay/usersInAccountAdminTable_UserInlineFragment.graphql";
import { filterGroups } from "@components/relay/change-user-in-account-groups-modal";
import { UsersInAccountAdminTableProps } from "@components/relay/users-in-account-admin-table/users-in-account-admin-table.interface";
import {
	USERS_IN_ACCOUNT_ADMIN_TABLE_INLINE_FRAGMENT,
	USERS_IN_ACCOUNT_ADMIN_TABLE_LIST_FRAGMENT,
	USERS_IN_ACCOUNT_ADMIN_TABLE_QUERY,
} from "@components/relay/users-in-account-admin-table/users-in-account-admin-table.graphql";

export const UsersInAccountAdminTable = ({ accountId }: UsersInAccountAdminTableProps) => {
	const data = useLazyLoadQuery<usersInAccountAdminTable_Query>(
		USERS_IN_ACCOUNT_ADMIN_TABLE_QUERY,
		{
			first: 20,
			accountId,
		},
		{ fetchPolicy: "network-only" },
	);

	const {
		data: {
			Admin: {
				Management: {
					UsersInAccountAdmin: { __id, edges },
				},
			},
		},
		hasNext,
		loadNext,
	} = usePaginationFragment<
		usersInAccountAdminTable_Query,
		usersInAccountAdminTable_UsersInAccountListFragment$key
	>(USERS_IN_ACCOUNT_ADMIN_TABLE_LIST_FRAGMENT, data);

	const UsersInAccount = edges?.map((b) =>
		readInlineData<usersInAccountAdminTable_UserInlineFragment$key>(
			USERS_IN_ACCOUNT_ADMIN_TABLE_INLINE_FRAGMENT,
			b!.node!,
		),
	);
	return (
		<div>
			<div className="flex justify-content-end">
				<CreateUserInAccountButton connectionId={__id} accountId={accountId} />
			</div>
			<TkDataTable
				selectionMode={"single"}
				dataKey={"id"}
				emptyMessage={"No users found"}
				className="mb-3"
				value={UsersInAccount}
			>
				<Column
					header="Name"
					sortable
					sortField={"user.name"}
					body={(row: usersInAccountAdminTable_UserInlineFragment$data) => {
						return row.user.name;
					}}
				/>
				<Column
					header="Email"
					sortable
					sortField={"user.email"}
					body={(row: usersInAccountAdminTable_UserInlineFragment$data) => {
						return row.user.email;
					}}
				/>
				<Column
					header="Activated"
					sortable
					sortField={"user.activated"}
					body={(row: usersInAccountAdminTable_UserInlineFragment$data) => {
						return row.user?.activated ? "Activated" : "Not activated";
					}}
				/>
				<Column
					header="Groups"
					sortable
					sortField={"groups.0.name"}
					body={(row: usersInAccountAdminTable_UserInlineFragment$data) => {
						return (
							<div className="flex align-items-center">
								<div>
									{filterGroups(row.groups)
										.map((g: any) => g.name)
										.join(", ")}
								</div>
								<ChangeUserGroupsAdminButton
									accountId={accountId}
									userInAccountFragment={row}
								/>
							</div>
						);
					}}
				/>
				<Column
					header="Actions"
					body={(row: usersInAccountAdminTable_UserInlineFragment$data) => {
						return (
							<div>
								<RemoveUserFromAccountAdminButton
									accountId={accountId}
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
					<TkButton
						type="button"
						className="p-button-secondary"
						onClick={() => loadNext(20)}
					>
						Load more
					</TkButton>
				</div>
			)}
		</div>
	);
};
