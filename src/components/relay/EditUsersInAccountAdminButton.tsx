import { graphql } from "babel-plugin-relay/macro";
import { TkButtonLink } from "../ui/TkButtonLink";
import { useFragment } from "react-relay";
import { useState } from "react";
import { EditUsersInAccountAdminModal } from "./EditUsersInAccountAdminModal";
import { EditUsersInAccountAdminButton_AccountFragment$key } from "../../__generated__/EditUsersInAccountAdminButton_AccountFragment.graphql";

const FRAGMENT = graphql`
	fragment EditUsersInAccountAdminButton_AccountFragment on Account {
		...EditUsersInAccountAdminModal_AccountFragment
	}
`;

interface OwnProps {
	className?: string;
	accountFragmentRef: EditUsersInAccountAdminButton_AccountFragment$key;
}

export const EditUsersInAccountAdminButton = ({ className, accountFragmentRef }: OwnProps) => {
	const [isVisible, setVisible] = useState(false);
	const account = useFragment<EditUsersInAccountAdminButton_AccountFragment$key>(
		FRAGMENT,
		accountFragmentRef,
	);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-users"
				iconPos="left"
				label="Users"
				onClick={() => setVisible(true)}
			/>

			<EditUsersInAccountAdminModal
				isVisible={isVisible}
				onHide={() => setVisible(false)}
				accountFragmentRef={account}
			/>
		</>
	);
};
