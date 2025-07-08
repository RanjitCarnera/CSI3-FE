import { useState } from "react";
import { EditRegionModal } from "./EditRegionModal";
import { TkButton } from "../ui/TkButton";

interface OwnProps {
	connectionId: string;
}

export const CreateRegionButton = ({ connectionId }: OwnProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);

	return (
		<div>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={"Create new region"}
			/>

			<EditRegionModal
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
