import graphql from "babel-plugin-relay/macro";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Suspense } from "react";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { AnonymizeAccountButton } from "./AnonymizeAccountButton";
import { ChangeAccountGroupsAdminButton } from "./ChangeAccountGroupsAdminButton";
import { CreateAccountButton } from "./CreateAccountButton";
import { EditAccountButton } from "./EditAccountButton";
import { EditUsersInAccountAdminButton } from "./EditUsersInAccountAdminButton";
import {
	type AccountsAdminTable_AccountInlineFragment$data,
	type AccountsAdminTable_AccountInlineFragment$key,
} from "../../__generated__/AccountsAdminTable_AccountInlineFragment.graphql";
import { type AccountsAdminTable_AccountsListFragment$key } from "../../__generated__/AccountsAdminTable_AccountsListFragment.graphql";
import { type AccountsAdminTable_Query } from "../../__generated__/AccountsAdminTable_Query.graphql";
import { type AccountsTable_Refetch } from "../../__generated__/AccountsTable_Refetch.graphql";
import { DateTimeDisplay } from "../ui/DateTimeDisplay";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query AccountsAdminTable_Query($first: Int) {
		...AccountsAdminTable_AccountsListFragment @arguments(first: $first)
	}
`;

const LIST_FRAGMENT = graphql`
	fragment AccountsAdminTable_AccountsListFragment on Query
	@refetchable(queryName: "AccountsTable_Refetch")
	@argumentDefinitions(first: { type: "Int", defaultValue: 20 }, after: { type: "String" }) {
		Admin {
			Management {
				AccountsAdmin(first: $first, after: $after)
					@connection(key: "AccountsTable_AccountsAdmin") {
					__id
					edges {
						node {
							...AccountsAdminTable_AccountInlineFragment
						}
					}
				}
			}
		}
	}
`;

const ACCOUNT_FRAGMENT = graphql`
	fragment AccountsAdminTable_AccountInlineFragment on Account @inline {
		id
		name
		groupAssociations {
			group {
				id
				name
			}
		}
		registeredAt
		...EditAccountButton_AccountFragment
		...EditUsersInAccountAdminButton_AccountFragment
		...AnonymizeAccountButton_AccountFragment
		...ChangeAccountGroupsAdminButton_AccountFragment
	}
`;

export const AccountsAdminTable = () => {
	const data = useLazyLoadQuery<AccountsAdminTable_Query>(QUERY, { first: 20 });

	const {
		hasNext,
		loadNext,
		data: {
			Admin: {
				Management: {
					AccountsAdmin: { __id, edges: accountEdges },
				},
			},
		},
	} = usePaginationFragment<AccountsTable_Refetch, AccountsAdminTable_AccountsListFragment$key>(
		LIST_FRAGMENT,
		data,
	);

	const accounts = accountEdges?.map((e) =>
		readInlineData<AccountsAdminTable_AccountInlineFragment$key>(ACCOUNT_FRAGMENT, e?.node!),
	);

	return (
		<>
			<div className="flex justify-content-end">
				<CreateAccountButton connectionId={__id} />
			</div>
			{accounts?.length ? (
				<div className="mb-5">
					<TkDataTable
						emptyMessage={
							<div className="flex justify-content-center align-items-center">
								<div className="mr-2">
									There are no accounts in the system yet yet.
								</div>
							</div>
						}
						className="mb-3"
						value={accounts}
					>
						<Column
							header="Name"
							body={(row: AccountsAdminTable_AccountInlineFragment$data) => {
								return row.name;
							}}
						/>
						<Column
							header="Groups"
							body={(row: AccountsAdminTable_AccountInlineFragment$data) => {
								return (
									<div className="flex align-items-center">
										<div>
											{row.groupAssociations
												?.map((g: any) => g.group?.name)
												.join(", ")}
										</div>
										<ChangeAccountGroupsAdminButton accountFragmentRef={row} />
									</div>
								);
							}}
						/>
						<Column
							header="Registered at"
							body={(row: AccountsAdminTable_AccountInlineFragment$data) => {
								return <DateTimeDisplay value={row.registeredAt} />;
							}}
						/>
						<Column
							header="Actions"
							body={(row: AccountsAdminTable_AccountInlineFragment$data) => {
								return (
									<div>
										<EditAccountButton
											className="mr-2"
											accountFragmentRef={row}
										/>
										<EditUsersInAccountAdminButton
											className="mr-2"
											accountFragmentRef={row}
										/>
										<AnonymizeAccountButton
											connectionId={__id}
											accountFragmentRef={row}
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
				</div>
			) : null}
		</>
	);
};
