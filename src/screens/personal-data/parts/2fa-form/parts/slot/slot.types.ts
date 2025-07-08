import { type InputVariant } from "@thekeytechnology/framework-react-components";

export interface SlotProps {
	icon?: string;
	title: string;
	subtitle: string;
	badges: SlotBadge[];
	actions: SlotAction[];
}
export interface SlotBadge {
	severity?: SlotSeverity;
	label: string;
}
export interface SlotAction {
	onClick: () => void;
	label: string;
	tooltip?: string;
	severity?: InputVariant;
	isDisabled?: boolean;
}
export type SlotSeverity = "success" | "info" | "warning";
