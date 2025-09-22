import { type AllocationTypes } from "@screens/staff-view/parts/allocation-bar/component/allocation-bar.consts";

export type AllocationType = keyof typeof AllocationTypes;

export interface AllocationBarProps {
	topOffset: number;
	allocationType?: AllocationType;
}

export interface Stage {
	color: string;
	name: string | "gap";
	id: string;
}
