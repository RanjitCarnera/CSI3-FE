import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense } from "react";
import { useFragment } from "react-relay";
import { UsersInAccountAdminTable } from "./users-in-account-admin-table/users-in-account-admin-table.component";
import { type EditUsersInAccountAdminModal_AccountFragment$key } from "../../__generated__/EditUsersInAccountAdminModal_AccountFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";

const FRAGMENT = graphql`
	fragment EditUsersInAccountAdminModal_AccountFragment on Account {
		id
		name
		registeredAt
	}
`;

interface OwnProps {
	accountFragmentRef: EditUsersInAccountAdminModal_AccountFragment$key;

	isVisible: boolean;
	onHide: () => void;
}

export const EditUsersInAccountAdminModal = ({
	accountFragmentRef,
	isVisible,
	onHide,
}: OwnProps) => {
	const account = useFragment<EditUsersInAccountAdminModal_AccountFragment$key>(
		FRAGMENT,
		accountFragmentRef,
	);

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{"Editing users in account " + account.name}</h1>}
			visible={isVisible}
			onHide={() => {
				onHide();
			}}
			footer={
				<div className="flex">
					<TkButtonLink
						type="button"
						onClick={() => {
							onHide();
						}}
						label={"Close"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Suspense fallback={"Loading..."}>
				<UsersInAccountAdminTable accountId={account.id} />
			</Suspense>
		</TkDialog>
	);
};
