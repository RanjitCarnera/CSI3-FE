import { type Moment } from "moment-timezone";

export interface ResizeAssignmentDialogueProps {
	dates: Moment[];
	onSuccess: () => void;
}
