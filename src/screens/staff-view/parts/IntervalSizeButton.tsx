import { TooltipPosition } from "@thekeytechnology/epic-ui";
import { Tooltip } from "@thekeytechnology/framework-react-components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TkSelectButton } from "../../../components/ui/TkSelectButton";
import {
	selectChangedAssignmentWeightsForIntervals,
	selectStaffViewFilters,
	setChangedAssignmentWeightsForInterval,
	setStaffViewFilters,
} from "../../../redux/StaffViewSlice";

interface OwnProps {
	className?: string;
}

export const IntervalSizeButton = ({ className }: OwnProps) => {
	const filters = useSelector(selectStaffViewFilters);

	const dispatch = useDispatch();
	const changedAssignmentWeights = useSelector(selectChangedAssignmentWeightsForIntervals);

	const targetId = "interval-select-button .p-selectbutton.p-buttonset > :first-child";
	return (
		<div className={`interval-select-button flex ${className ?? ""}`}>
			<Tooltip
				target={`${targetId}`}
				content={"Capped to 120 days."}
				position={TooltipPosition.Top}
			/>

			<TkSelectButton
				value={filters?.intervalType || "Weeks"}
				options={["Days", "Weeks", "Months", "Quarters"]}
				onChange={(e) => {
					dispatch(setChangedAssignmentWeightsForInterval([]));
					if (changedAssignmentWeights.length) {
						toast.warn("Cleared changed weightings. Please submit first.");
					}
					dispatch(
						setStaffViewFilters({
							...filters,
							intervalType: e.value || filters.intervalType,
						}),
					);
				}}
			/>
		</div>
	);
};
