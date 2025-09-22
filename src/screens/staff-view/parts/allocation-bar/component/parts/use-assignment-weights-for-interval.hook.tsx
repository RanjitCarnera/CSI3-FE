import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAssignmentWeightsForIntervals } from "@redux/StaffViewSlice";

export const useAssignmentWeightsForInterval = (assignmentRef?: string) => {
	const assignmentWeights = useSelector(selectAssignmentWeightsForIntervals);
	const filtered = useMemo(
		() => assignmentWeights?.filter((e) => e.assignmentRef === assignmentRef) ?? [],
		[assignmentWeights, assignmentRef],
	);
	if (!assignmentRef) return null;
	return filtered;
};
