import { TkButton } from "../ui/TkButton";
import { useState } from "react";
import { EditUserInAccountGroupModalComponent } from "./edit-user-in-account-group-modal/edit-user-in-account-group-modal.component";

interface OwnProps {
	connectionId: string;
}

export const CreateGroupButton = ({ connectionId }: OwnProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);

	return (
		<div>
			<TkButton onClick={() => setVisible(true)} label={"Create group"} />

			<EditUserInAccountGroupModalComponent
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
