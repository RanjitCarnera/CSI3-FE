import { type Moment } from "moment";
import { type ResizeDirection } from "re-resizable";
import { createContext } from "react";
import { type Grid } from "react-rnd";
import { type allocationBarProvider_AllocationFragment$data } from "@relay/allocationBarProvider_AllocationFragment.graphql";
import { type IntervalType } from "@relay/staffViewPart_Query.graphql";

export enum ShowingModalStatus {
	MOVED,
	RESIZED,
	HIDDEN,
}

export interface State {
	width: number;
	x: number;
	y: number;
	deltaWidth: number;
	dir: ResizeDirection;
}

export interface IAllocationBarContext {
	allocation: allocationBarProvider_AllocationFragment$data | undefined;
	laneAllocationIds: string[];
	state: State;
	oldState: State;
	setState: React.Dispatch<State>;
	setOldState: React.Dispatch<State>;
	showingModal: ShowingModalStatus;
	toggleShowingModal: (status: ShowingModalStatus) => void;
	getResizedDates: (
		allocation: allocationBarProvider_AllocationFragment$data,
		dir: ResizeDirection,
		widthDelta: number,
		intervalType: IntervalType,
	) => Promise<void>;
	getMovedDates: (
		allocation: allocationBarProvider_AllocationFragment$data,
		widthDelta: number,
		intervalType: IntervalType,
	) => Promise<void>;
	resizeGrid: Grid;
	isMasterPlan: boolean;
	movedDates: Moment[];
	setMovedDates: (movedDates: Moment[]) => void;
	resizedDates: Moment[];
	setResizedDates: (dates: Moment[]) => void;
	intervalType: IntervalType;
	doesChainWithNextBar: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AllocationBarContext = createContext<IAllocationBarContext>({
	allocation: undefined,
	laneAllocationIds: [],
	state: {
		width: 0,
		x: 0,
		y: 0,
		deltaWidth: 0,
		dir: "bottom",
	} as State,
	oldState: {
		width: 0,
		x: 0,
		y: 0,
		deltaWidth: 0,
		dir: "bottom",
	} as State,
	setState: () => {},
	setOldState: () => {},
	showingModal: ShowingModalStatus.HIDDEN,
	toggleShowingModal: (status: ShowingModalStatus) => {},
	getResizedDates: async () => {},
	getMovedDates: async () => {},
	resizeGrid: [100, 1],
	isMasterPlan: false,
	movedDates: [],
	setMovedDates: () => {},
	resizedDates: [],
	setResizedDates: () => {},
	intervalType: "Weeks",
	doesChainWithNextBar: false,
});
