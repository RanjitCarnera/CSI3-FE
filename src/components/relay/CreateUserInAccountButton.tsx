import { TkButton } from "../ui/TkButton";
import { useState } from "react";
import { CreateUserInAccountModal } from "./create-user-in-account-modal/create-user-in-account-modal.component";

interface OwnProps {
	accountId: string;
	connectionId: string;
}

export const CreateUserInAccountButton = ({ accountId, connectionId }: OwnProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);

	return (
		<div>
			<TkButton onClick={() => setVisible(true)} label={"Create/add user to account"} />

			<CreateUserInAccountModal
				accountId={accountId}
				connectionId={connectionId}
				isVisible={isVisible}
				onHide={() => setVisible(false)}
				onCompleted={() => {
					setVisible(false);
				}}
			/>
		</div>
	);
};
