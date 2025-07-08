import { graphql } from "babel-plugin-relay/macro";
import { type Moment } from "moment";
import moment from "moment-timezone";
import { type ResizeDirection } from "re-resizable";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useMutation } from "react-relay";
import { type Grid } from "react-rnd";
import { selectStaffViewFilters } from "@redux/StaffViewSlice";
import {
	type allocationBarProvider_AllocationFragment$data,
	type allocationBarProvider_AllocationFragment$key,
} from "@relay/allocationBarProvider_AllocationFragment.graphql";
import { type allocationBarProvider_ApproximateAssignmentResizeMutation } from "@relay/allocationBarProvider_ApproximateAssignmentResizeMutation.graphql";
import { type allocationBarProvider_ApproximateMoveAssignmentMutation } from "@relay/allocationBarProvider_ApproximateMoveAssignmentMutation.graphql";
import { type allocationBarProvider_IntervalFragment$data } from "@relay/allocationBarProvider_IntervalFragment.graphql";
import { type allocationBarProvider_ScenarioFragment$key } from "@relay/allocationBarProvider_ScenarioFragment.graphql";
import { type IntervalType } from "@relay/staffViewPart_Query.graphql";
import {
	APPROXIMATE_ASSIGNMENT_RESIZE_MUTATION,
	APPROXIMATE_MOVE_ASSIGNMENT_MUTATION,
} from "@screens/staff-view/parts/allocation-bar/context/allocation-bar-provider.graphql";
import { type AllocationBarProviderState } from "@screens/staff-view/parts/allocation-bar/context/allocation-bar-provider.types";
import { COLUMN_WIDTH } from "@screens/staff-view/parts/staff-view.utils";
import { AllocationBarContext, type IAllocationBarContext, ShowingModalStatus } from "./context";

export const INTERVAL_FRAGMENT = graphql`
	fragment allocationBarProvider_IntervalFragment on IntervalDescription @inline {
		index
		startDate
		endDate
		fallsIntoCustomUtilizationWindow
	}
`;

export const ALLOCATION_FRAGMENT = graphql`
	fragment allocationBarProvider_AllocationFragment on LaneAllocation @inline {
		id
		fromInterval
		fromIntervalPercentage
		toInterval
		toIntervalPercentage
		startDate
		endDate
		assignment {
			id
			startDate
			endDate
			isExecutive
			validAssignmentRoles {
				id
			}
			comment
			importId
			weight
			person {
				id
			}

			project {
				id
				name
				volume
				stage {
					id
					name
					color
				}
				milestones {
					data {
						name
						date
					}
				}
			}
			validAssignmentRoles {
				name
			}
			person {
				name
				assignmentRole {
					id
					name
				}
			}
			tags {
				id
				data {
					color
					sortOrder
				}
			}
		}
		isGap
		lengthInDays
	}
`;

const SCENARIO_FRAGMENT = graphql`
	fragment allocationBarProvider_ScenarioFragment on Scenario {
		id
		isMasterPlan
	}
`;

export interface AllocationBarProviderRef {
	resetPosition: () => void;
}

interface AllocationBarProviderProps {
	children: React.ReactNode | React.ReactNode[];
	laneAllocationIds: string[];
	laneAllocationFragmentRef: allocationBarProvider_AllocationFragment$key;
	intervalDescriptions: allocationBarProvider_IntervalFragment$data[];
	scenarioFragmentRef: allocationBarProvider_ScenarioFragment$key;
	doesChainWithTheNextBar: boolean;
}

export const AllocationBarProvider = forwardRef(function AllocationBarProvider(
	{
		children,
		laneAllocationFragmentRef,
		laneAllocationIds,
		intervalDescriptions,
		scenarioFragmentRef,
		doesChainWithTheNextBar,
	}: AllocationBarProviderProps,
	ref,
) {
	const [approximateResize] =
		useMutation<allocationBarProvider_ApproximateAssignmentResizeMutation>(
			APPROXIMATE_ASSIGNMENT_RESIZE_MUTATION,
		);

	const [approximateMove] = useMutation<allocationBarProvider_ApproximateMoveAssignmentMutation>(
		APPROXIMATE_MOVE_ASSIGNMENT_MUTATION,
	);

	const scenarioFragment = useFragment<allocationBarProvider_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);

	const filters = useSelector(selectStaffViewFilters);
	const intervalType = filters.intervalType || "Weeks";

	useImperativeHandle(ref, () => ({
		resetPosition() {
			const { x: _, ...newState } = { ...state };
			setState({ ...newState, x: 0 });
		},
	}));

	const allocation = readInlineData<allocationBarProvider_AllocationFragment$key>(
		ALLOCATION_FRAGMENT,
		laneAllocationFragmentRef,
	);

	const width = useMemo(
		() =>
			((allocation.toInterval ?? 0) - (allocation.fromInterval ?? 0)) * COLUMN_WIDTH +
			(!doesChainWithTheNextBar ? 0 : 1) * COLUMN_WIDTH,
		[
			filters,
			intervalType,
			allocation,
			laneAllocationFragmentRef,
			laneAllocationIds,
			intervalDescriptions,
		],
	);

	const intervalStartOffset = (allocation.fromIntervalPercentage ?? 0) * COLUMN_WIDTH;
	const intervalEndOffset = (allocation.toIntervalPercentage ?? 0) * COLUMN_WIDTH;

	const widthWithOffsets = useMemo(
		() => width + (intervalEndOffset - intervalStartOffset),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			filters,
			intervalType,
			allocation,
			laneAllocationFragmentRef,
			laneAllocationIds,
			intervalDescriptions,
		],
	);

	const resizeGrid = useMemo(
		() =>
			[
				COLUMN_WIDTH /
					(intervalType === "Weeks"
						? 7
						: intervalType === "Months"
						? 4
						: intervalType === "Quarters"
						? 3
						: 1),
				1,
			] as Grid,
		[
			filters,
			intervalType,
			allocation,
			laneAllocationFragmentRef,
			laneAllocationIds,
			intervalDescriptions,
		],
	);

	const baseState: AllocationBarProviderState = {
		width: floorToNearestMultipleOfStep(widthWithOffsets, resizeGrid[0]),
		x: 0,
		y: 0,
		deltaWidth: 0,
		dir: "bottom",
	};

	const [state, setState] = useState<AllocationBarProviderState>({ ...baseState });
	const [oldState, setOldState] = useState<AllocationBarProviderState>({ ...baseState });
	const [showingModal, setShowingModal] = useState<ShowingModalStatus>(ShowingModalStatus.HIDDEN);
	const [movedDates, setMovedDates] = useState<Moment[]>([]);
	const [resizedDates, setResizedDates] = useState<Moment[]>([]);

	const value: IAllocationBarContext = {
		allocation,
		laneAllocationIds,
		toggleShowingModal: (status: ShowingModalStatus) => {
			setShowingModal(status);
		},
		showingModal,
		state,
		oldState,
		setState,
		movedDates,
		setMovedDates,
		resizedDates,
		setResizedDates,
		setOldState,
		getResizedDates,
		getMovedDates,
		intervalType,
		resizeGrid,
		isMasterPlan: scenarioFragment.isMasterPlan,
		doesChainWithNextBar: doesChainWithTheNextBar,
	};

	useEffect(() => {
		setState({
			...state,
			width: floorToNearestMultipleOfStep(widthWithOffsets, resizeGrid[0]),
		});
	}, [
		filters,
		intervalType,
		allocation,
		laneAllocationFragmentRef,
		laneAllocationIds,
		intervalDescriptions,
	]);

	async function getResizedDates(
		allocation: allocationBarProvider_AllocationFragment$data,
		dir: ResizeDirection,
		widthDelta: number,
		intervalType: IntervalType,
	): Promise<void> {
		const isStartDate = dir === "left";

		approximateResize({
			variables: {
				input: {
					assignmentId: allocation.assignment?.id!,
					increments: widthDelta,
					intervalType,
					isStartDate,
				},
			},
			onCompleted: (res) => {
				setResizedDates([
					moment(res.Staffview.approximateAssignmentResize?.startDate!),
					moment(res.Staffview.approximateAssignmentResize?.endDate),
				]);
			},
		});
	}

	async function getMovedDates(
		allocation: allocationBarProvider_AllocationFragment$data,
		widthDelta: number,
		intervalType: IntervalType,
	): Promise<void> {
		approximateMove({
			variables: {
				input: {
					assignmentId: allocation.assignment?.id!,
					intervalType,
					increments: widthDelta,
				},
			},
			onCompleted: (res) => {
				setMovedDates([
					moment(res.Staffview.approximateMoveAssignment?.startDate),
					moment(res.Staffview.approximateMoveAssignment?.endDate),
				]);
			},
		});
	}

	return <AllocationBarContext.Provider value={value}>{children}</AllocationBarContext.Provider>;
});

export function floorToNearestMultipleOfStep(value: number, step: number) {
	// Calculate the nearest multiple of step
	const nearestMultiple = Math.round(value / step) * step;

	// Format the result to two decimal places
	const formattedValue = nearestMultiple.toFixed(2);

	return parseFloat(formattedValue); // Convert back to a number
}
