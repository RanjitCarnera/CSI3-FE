import { type Moment } from "moment-timezone";

export interface MoveAssignmentDialougeProps {
	dates: Moment[];
	onSuccess: () => void;
}
