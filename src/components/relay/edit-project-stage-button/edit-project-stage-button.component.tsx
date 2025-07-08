import { TkButtonLink } from "../../ui/TkButtonLink";
import { EditProjectStageModal } from "../edit-project-stage-modal";
import { useFragment } from "react-relay";
import { useState } from "react";
import { editProjectStageButton_ProjectStageFragment$key } from "../../../__generated__/editProjectStageButton_ProjectStageFragment.graphql";
import { EditProjectStageButtonProps } from "./edit-project-stage-button.interface";
import { PROJECT_FRAGMENT } from "./edit-project-stage-button.graphql";

export const EditProjectStageButton = ({
	className,
	regionFragmentRef,
}: EditProjectStageButtonProps) => {
	const [isVisible, setVisible] = useState(false);
	const ProjectStage = useFragment<editProjectStageButton_ProjectStageFragment$key>(
		PROJECT_FRAGMENT,
		regionFragmentRef,
	);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label="Edit"
				onClick={() => setVisible(true)}
			/>

			<EditProjectStageModal
				isVisible={isVisible}
				onHide={() => setVisible(false)}
				onCompleted={() => setVisible(false)}
				projectStageFragmentRef={ProjectStage}
			/>
		</>
	);
};
