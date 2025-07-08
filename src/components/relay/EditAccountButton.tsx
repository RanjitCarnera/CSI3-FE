import { graphql } from "babel-plugin-relay/macro";
import { useState } from "react";
import { useFragment } from "react-relay";
import { EditAccountModal } from "./EditAccountModal";
import { type EditAccountButton_AccountFragment$key } from "../../__generated__/EditAccountButton_AccountFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";

const FRAGMENT = graphql`
	fragment EditAccountButton_AccountFragment on Account {
		...EditAccountModal_AccountFragment
	}
`;

interface OwnProps {
	className?: string;
	accountFragmentRef: EditAccountButton_AccountFragment$key;
}

export const EditAccountButton = ({ className, accountFragmentRef }: OwnProps) => {
	const [isVisible, setVisible] = useState(false);
	const account = useFragment<EditAccountButton_AccountFragment$key>(
		FRAGMENT,
		accountFragmentRef,
	);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label="Edit"
				onClick={() => {
					setVisible(true);
				}}
			/>

			<EditAccountModal
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				onCompleted={() => {
					setVisible(false);
				}}
				accountFragmentRef={account}
			/>
		</>
	);
};
