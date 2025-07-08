import { useState } from "react";
import { type CreateDivisionButtonProps } from "@components/create-division-button/create-division-button.types";
import { EditDivisionModal } from "@components/relay/EditDivisionModal";
import { TkButton } from "../ui/TkButton";

export const CreateDivisionButton = ({ connectionId }: CreateDivisionButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);

	return (
		<div>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={"Create new division"}
			/>

			<EditDivisionModal
				connectionId={connectionId}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				onCompleted={() => {
					setVisible(false);
				}}
			/>
		</div>
	);
};
