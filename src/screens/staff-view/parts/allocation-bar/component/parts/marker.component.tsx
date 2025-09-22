import { Tooltip } from "@thekeytechnology/framework-react-components";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "@components/ui/DateTimeDisplay";
import { selectShowWeights, selectStaffViewFilters } from "@redux/StaffViewSlice";
import { COLUMN_WIDTH } from "@screens/staff-view/parts/staff-view.utils";
import { getInterval } from "../allocation-bar.utils";

export const Marker = ({
	date,
	name,
	index,
	projectId,
	absoluteLeft,
	allocationFromInterval,
	allocationToInterval,
	projectName,
}: {
	date: string;
	name: string;
	index: number;
	projectId: string;
	absoluteLeft: number;
	allocationFromInterval: number;
	allocationToInterval: number;
	projectName: string;
}) => {
	const filters = useSelector(selectStaffViewFilters);
	const showWeights = useSelector(selectShowWeights);

	const dateAsDate = new Date(date);
	const interval = getInterval(dateAsDate, filters.intervalType);
	const milestoneMargin = date ? interval * COLUMN_WIDTH - absoluteLeft : 0;

	const shouldShowMilestone =
		interval <= allocationToInterval && interval >= allocationFromInterval;
	const formattedProjectId = projectId.replace("=", "").replace("=", "");
	const tooltipTargetId = `tooltip-${formattedProjectId}-${index}`;

	if (!shouldShowMilestone) return <Fragment />;
	return (
		<>
			<Tooltip target={`#${tooltipTargetId}`} content={""} />

			<div
				className="hide-print"
				id={tooltipTargetId}
				style={{
					width: "1rem",
					height: "1rem",
					marginLeft: milestoneMargin,
					transform: `translate(-6px,${showWeights ? "-4.96rem" : "-3.3rem"})`,
					position: "absolute",
					cursor: "pointer",
				}}
				data-pr-tooltip={`${projectName}: ${name} - ${formatDate(date)}`}
				data-pr-position="right"
				data-pr-at="right+5 top"
				data-pr-my="left center-2"
			>
				<div className="pi pi-star"></div>
			</div>
		</>
	);
};
