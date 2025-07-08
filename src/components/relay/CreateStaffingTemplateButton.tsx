import { useState } from "react";
import { EditStaffingTemplateModal } from "./EditStaffingTemplateModal";
import { TkButton } from "../ui/TkButton";

interface OwnProps {
	connectionId: string;
}

export const CreateStaffingTemplateButton = ({ connectionId }: OwnProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);

	return (
		<div>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={"Create new Staffing Template"}
			/>

			<EditStaffingTemplateModal
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
