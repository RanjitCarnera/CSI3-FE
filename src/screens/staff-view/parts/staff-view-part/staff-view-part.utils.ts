import { convertToMomentDate } from "@components/ui/DateTimeDisplay";
import type { allocationBarProvider_AllocationFragment$data } from "@relay/allocationBarProvider_AllocationFragment.graphql";
import {
	LANE_HEIGHT,
	LANE_MIN_HEIGHT,
	MARGIN_BETWEEN_LANES,
	WITH_WEIGHTS_MODIFIER,
} from "@screens/staff-view/parts/staff-view.utils";

export const calculateLaneHeight = (
	laneAmount: number,
	hasMoreThan1Lane: boolean,
	showWeights: boolean,
) => {
	const factor = showWeights ? (hasMoreThan1Lane ? WITH_WEIGHTS_MODIFIER : 1) : 1;
	return Math.max(
		LANE_MIN_HEIGHT * factor,
		laneAmount * (LANE_HEIGHT * factor) + (laneAmount - 1) * MARGIN_BETWEEN_LANES,
	);
};

export const checkIfAnAllocationChainsWithTheNextOne = (
	currentAllocation: Pick<allocationBarProvider_AllocationFragment$data, "endDate">,
	nextAllocation: Pick<allocationBarProvider_AllocationFragment$data, "startDate">,
): boolean => {
	if (nextAllocation) {
		return convertToMomentDate(currentAllocation.endDate).isSame(
			convertToMomentDate(nextAllocation.startDate).subtract(1, "day"),
		);
	}

	return false;
};
