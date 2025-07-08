import { TooltipPosition } from "@thekeytechnology/epic-ui";
import { Tooltip } from "@thekeytechnology/framework-react-components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TkSelectButton } from "../../../components/ui/TkSelectButton";
import { selectStaffViewFilters, setStaffViewFilters } from "../../../redux/StaffViewSlice";

interface OwnProps {
	className?: string;
}

export const IntervalSizeButton = ({ className }: OwnProps) => {
	const filters = useSelector(selectStaffViewFilters);

	const dispatch = useDispatch();

	const targetId = ".p-selectbutton.p-buttonset > :first-child";
	return (
		<div className={`flex ${className ?? ""}`}>
			<Tooltip
				target={`${targetId}`}
				content={"Capped to 120 days."}
				position={TooltipPosition.Top}
			/>

			<TkSelectButton
				value={filters?.intervalType || "Weeks"}
				options={["Days", "Weeks", "Months", "Quarters"]}
				onChange={(e) => {
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
