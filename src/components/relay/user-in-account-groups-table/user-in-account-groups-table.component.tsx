import { Column } from "primereact/column";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { EditUserInAccountGroupButton } from "@components/relay/edit-user-in-account-group-button";
import {
	USER_IN_ACCOUNT_GROUP_INLINE_FRAGMENT,
	USER_IN_ACCOUNT_GROUPS_TABLE_LIST_FRAGMENT,
	USER_IN_ACCOUNT_GROUPS_TABLE_QUERY,
} from "@components/relay/user-in-account-groups-table/user-in-account-groups-table.graphql";
import { PERMISSION_TRANSLATIONS } from "@i18n/permissions.i18n";
import { type userInAccountGroupsTable_GroupListFragment$key } from "@relay/userInAccountGroupsTable_GroupListFragment.graphql";
import { type userInAccountGroupsTable_Query } from "@relay/userInAccountGroupsTable_Query.graphql";
import { type userInAccountGroupsTable_Refetch } from "@relay/userInAccountGroupsTable_Refetch.graphql";
import {
	type Permission,
	type userInAccountGroupsTable_userInAccountGroupInlineFragment$data,
	type userInAccountGroupsTable_userInAccountGroupInlineFragment$key,
} from "@relay/userInAccountGroupsTable_userInAccountGroupInlineFragment.graphql";
import { TkDataTable } from "../../ui/TkDataTable";
import { CreateGroupButton } from "../CreateGroupButton";
import { DeleteGroupButton } from "../DeleteGroupButton";

export const UserInAccountGroupsTable = () => {
	const query = useLazyLoadQuery<userInAccountGroupsTable_Query>(
		USER_IN_ACCOUNT_GROUPS_TABLE_QUERY,
		{ first: 20 },
	);

	const {
		data: {
			Management: {
				Groups: { __id, edges: groups },
			},
		},
	} = usePaginationFragment<
		userInAccountGroupsTable_Refetch,
		userInAccountGroupsTable_GroupListFragment$key
	>(USER_IN_ACCOUNT_GROUPS_TABLE_LIST_FRAGMENT, query);

	const inlineGroups = groups?.map((edge) =>
		readInlineData<userInAccountGroupsTable_userInAccountGroupInlineFragment$key>(
			USER_IN_ACCOUNT_GROUP_INLINE_FRAGMENT,
			edge!.node,
		),
	);
	return (
		<>
			<div className="flex justify-content-end">
				<CreateGroupButton connectionId={__id} />
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no groups in your account yet.</div>
					</div>
				}
				className="mb-3"
				value={inlineGroups}
			>
				<Column
					header="Name"
					sortable
					sortField={"name"}
					body={(row) => {
						return row.name;
					}}
				/>
				<Column
					header="Permissions"
					body={(row: userInAccountGroupsTable_userInAccountGroupInlineFragment$data) => {
						const x = atob(row.id);
						if (x === "Group:owner") {
							return "Users in this group always have all permissions.";
						} else if (x === "Group:user") {
							return "Users in this group have no special permissions.";
						} else {
							return row.permissions
								.map((p: any) => PERMISSION_TRANSLATIONS[p as Permission] || p)
								.join(", ");
						}
					}}
				/>
				<Column
					header="Actions"
					body={(row: userInAccountGroupsTable_userInAccountGroupInlineFragment$data) => {
						const x = atob(row.id);

						if (x === "Group:owner" || x === "Group:user") {
							return <div>Built-in groups cannot be edited</div>;
						} else {
							return (
								<div className="flex">
									<EditUserInAccountGroupButton
										className="mr-2"
										groupFragmentRef={row}
									/>
									<DeleteGroupButton connectionId={__id} groupId={row.id} />
								</div>
							);
						}
					}}
				/>
			</TkDataTable>
		</>
	);
};
