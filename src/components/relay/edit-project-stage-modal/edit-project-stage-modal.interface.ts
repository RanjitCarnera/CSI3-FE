import { editProjectStageModal_ProjectStageFragment$key } from "../../../__generated__/editProjectStageModal_ProjectStageFragment.graphql";

export interface EditProjectStageModalProps {
	projectStageFragmentRef?: editProjectStageModal_ProjectStageFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

export interface EditProjectStageModalFormState {
	name?: string;

	reverseProjectOrderInReports?: boolean;

	sortOrder?: number;
	color?: string;
}
