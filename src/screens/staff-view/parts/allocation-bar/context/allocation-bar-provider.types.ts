import { type ResizeDirection } from "re-resizable";

export interface AllocationBarProviderState {
	width: number;
	x: number;
	y: number;
	deltaWidth: number;
	dir: ResizeDirection;
}
