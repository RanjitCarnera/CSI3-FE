import { TkButton } from "../../ui/TkButton";
import { useState } from "react";
import { EditProjectStageModal } from "../edit-project-stage-modal";
import { CreateProjectStageButtonProps } from "./create-project-stage-button.interface";

export const CreateProjectStageButton = ({
	className,
	connectionId,
}: CreateProjectStageButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);

	return (
		<div className={className}>
			<TkButton onClick={() => setVisible(true)} label={"Create new project stage"} />

			<EditProjectStageModal
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
