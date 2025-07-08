import { Tooltip } from "@thekeytechnology/framework-react-components";
import moment from "moment-timezone";
import React, { useContext, useId, useMemo } from "react";
import { type DraggableEventHandler } from "react-draggable";
import { useSelector } from "react-redux";
import { Rnd, type RndResizeCallback } from "react-rnd";
import shader from "shader";
import styled from "styled-components";
import { CurrencyDisplayUtil, formatCurrency } from "@components/ui/CurrencyDisplay";
import { DateDisplay, formatDate } from "@components/ui/DateTimeDisplay";
import { PrintableTooltip } from "@components/ui/PrintableTooltip";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { selectShouldUseTagColor, selectStaffViewFilters } from "@redux/StaffViewSlice";
import { type IntervalType } from "@relay/staffViewPart_Query.graphql";
import { COLUMN_WIDTH, LANE_HEIGHT } from "@screens/staff-view/parts/staff-view.utils";
import { hexToRgb } from "@utils/color-conversion";
import { AllocationBarContext, floorToNearestMultipleOfStep } from "./allocation-bar/context";
import { MoveAssignmentDialogue } from "./allocation-bar/move-assignment-dialogue/move-assignment-dialogue.component";
import { ResizeAssigmentDialogue } from "./allocation-bar/resize-assignment-dialogue";

const AllocationTypes = {
	personAllocation: "personAllocation",
	unfilledAllocation: "unfilledAllocation",
} as const;
type AllocationType = keyof typeof AllocationTypes;

interface OwnProps {
	topOffset: number;
	allocationType?: AllocationType;
}

interface Stage {
	color: string;
	name: string | "gap";
	id: string;
}

const getTextColorFromCustomBackgroundColor = (hex?: string): "#ffffff" | "#000000" => {
	if (!hex) return "#000000";
	const rgb = hexToRgb(hex);
	const black = "#000000";
	const white = "#ffffff";

	if (!rgb) return black;
	const contrastRatio = rgb?.r * 0.299 + rgb.g * 0.587 + rgb?.b * 0.114;
	return contrastRatio > 186 ? black : white;
};

const getSecondaryTextColorFromCustomBackGroundColor = (hex?: string): string => {
	const blackOrWhite = getTextColorFromCustomBackgroundColor(hex);
	const isBlack = blackOrWhite === "#000000";
	const delta = isBlack ? 0.1 : -0.1;
	return shader(blackOrWhite, delta);
};

export const AllocationBarComponent = ({ topOffset, allocationType }: OwnProps) => {
	const toolTipTarget = useId().replace(":", "").replace(":", "");

	const shouldUseTagColor = useSelector(selectShouldUseTagColor);
	const {
		allocation,
		state,
		resizedDates,
		movedDates,
		setMovedDates,
		setResizedDates,
		getResizedDates,
		setOldState,
		setState,
		intervalType,
		getMovedDates,
		resizeGrid,
		isMasterPlan,
		doesChainWithNextBar,
	} = useContext(AllocationBarContext);

	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	if (!allocation) return <div>Missing Allocation</div>;

	const width = useMemo(
		() =>
			((allocation.toInterval ?? 0) - (allocation.fromInterval ?? 0)) * COLUMN_WIDTH +
			(doesChainWithNextBar ? 0 : (allocation.toIntervalPercentage ?? 1) * COLUMN_WIDTH),
		[allocation],
	);

	const intervalStartOffset = useMemo(
		() => (allocation.fromIntervalPercentage || 0) * COLUMN_WIDTH,
		[allocation],
	);

	const intervalEndOffset = useMemo(
		() => (allocation.toIntervalPercentage || 0) * COLUMN_WIDTH,
		[allocation],
	);

	const widthWithOffsets = useMemo(
		() => width + (intervalEndOffset - intervalStartOffset),
		[allocation],
	);

	const projectNameText =
		allocation.assignment?.project?.name ||
		`${allocation.lengthInDays} day${allocation.lengthInDays > 1 ? "s" : ""} Gap`;
	const isGapTextAllocationBar = !allocation.assignment?.project?.name;

	const isGap = allocation.isGap;
	const hideBar = !gapDaysEnabled && isGap;

	const project = allocation.assignment?.project;

	const tagColor = allocation.assignment?.tags.slice().reduce(
		(prev, curr, arr) => {
			if (!prev) return curr;
			return prev?.data?.sortOrder < curr?.data.sortOrder ? prev : curr;
		},
		undefined as
			| undefined
			| {
					readonly data: {
						readonly color: string;
						readonly sortOrder: number;
					};
					readonly id: string;
			  },
	)?.data.color;

	const children = (
		<React.Fragment>
			{!hideBar && (
				<>
					<PrintableTooltip
						content={[
							projectNameText,
							allocation.assignment?.project.volume
								? `Volume: ${formatCurrency(
										allocation.assignment?.project.volume,
										CurrencyDisplayUtil.formatter.million,
								  )}`
								: undefined,
							allocation?.assignment
								? `Role(s): ${allocation?.assignment?.validAssignmentRoles
										?.map((va) => va.name)
										.join(", ")}`
								: undefined,
							formatDate(allocation.startDate),
							formatDate(allocation.endDate),
						]
							.filter((x) => x)
							.join(" - ")}
						target={`#${toolTipTarget}`}
						position={"bottom"}
					/>
					<AllocationContainer
						isGap={isGap}
						allocationType={allocationType}
						stage={
							isGap
								? ({ name: "gap", color: "", id: "" } as Stage)
								: (allocation.assignment?.project.stage as Stage)
						}
						tagColor={tagColor}
						shouldUseTagColor={shouldUseTagColor}
						id={toolTipTarget}
					>
						<AllocationBar>
							<BarText>
								<ProjectNameDisplay className="name-display">
									{projectNameText}
								</ProjectNameDisplay>
								<DateRangeDisplay
									allocationType={allocationType}
									stage={allocation.assignment?.project.stage as Stage}
								>
									<DateDisplay value={allocation.startDate} /> -{" "}
									<DateDisplay value={allocation.endDate} />
								</DateRangeDisplay>
							</BarText>
						</AllocationBar>
					</AllocationContainer>
				</>
			)}
			{project?.milestones.map((ms) => (
				<Marker date={ms.data.date} name={ms.data.name} key={ms.data.name} />
			))}
		</React.Fragment>
	);

	const absoluteLeft = floorToNearestMultipleOfStep(
		(allocation.fromInterval ?? 0) * COLUMN_WIDTH + intervalStartOffset,
		resizeGrid[0],
	);

	const hasEditPermissions = hasPermissions(
		!isMasterPlan
			? ["UserInAccountPermission_Scenario_Edit"]
			: [
					"UserInAccountPermission_Scenario_Edit",
					"UserInAccountPermission_Scenario_Masterplan",
			  ],
	);

	const onDragStop: DraggableEventHandler = (_, data) => {
		if (!hasEditPermissions) return;
		setOldState({ ...state });
		setState({ ...state, x: data.x, y: data.y });
		void getMovedDates(allocation, data.x / 100, intervalType);
	};

	const onResizeStop: RndResizeCallback = (e, dir, ref, delta, position) => {
		if (!hasEditPermissions) return;
		setOldState({ ...state });
		setState({
			width: ref.offsetWidth,
			dir,
			deltaWidth: delta.width,
			...position,
		});
		void getResizedDates(
			allocation,
			dir,
			((dir === "left" ? -1 : 1) * delta.width) / 100,
			intervalType,
		);
	};

	const isDisabled = !hasEditPermissions || isGapTextAllocationBar;

	const canDragLeft = moment() < moment(allocation.assignment?.startDate);
	const canDragRight = moment() > moment(allocation.assignment?.startDate);

	return (
		<>
			{resizedDates.length ? (
				<ResizeAssigmentDialogue
					dates={resizedDates}
					onSuccess={() => {
						setResizedDates([]);
					}}
				/>
			) : (
				<></>
			)}
			{movedDates.length ? (
				<MoveAssignmentDialogue
					dates={movedDates}
					onSuccess={() => {
						setMovedDates([]);
					}}
				/>
			) : (
				<></>
			)}
			<div
				className="z-5 absolute"
				id={"wrapper"}
				style={{
					top: topOffset,
					left: absoluteLeft,
					height: LANE_HEIGHT,
					width: widthWithOffsets,
				}}
			>
				{
					<Rnd
						disableDragging={isDisabled}
						size={{ width: state.width, height: LANE_HEIGHT }}
						position={{ x: state.x, y: state.y }}
						dragAxis={"x"}
						dragGrid={resizeGrid}
						onDragStop={onDragStop}
						resizeGrid={resizeGrid}
						enableResizing={{
							top: false,
							right: canDragRight,
							bottom: false,
							left: canDragLeft,
							topRight: false,
							topLeft: false,
							bottomLeft: false,
							bottomRight: false,
						}}
						onResizeStop={onResizeStop}
					>
						{children}
					</Rnd>
				}
			</div>
		</>
	);
};

const AllocationContainer = styled.div<{
	stage?: Stage;
	isGap: boolean;
	allocationType?: AllocationType;
	tagColor?: string;
	shouldUseTagColor?: boolean;
}>`
	background-color: ${(props) => {
		if (props.isGap || props.allocationType === AllocationTypes.unfilledAllocation)
			return "#FFF5F5";
		if (props.stage?.color) return props.stage.color;
		return "#EAEFFA";
	}};
	height: 30px;
	display: flex;
	align-items: center;
	padding-left: 20px;
	border: ${(props) => {
		if (
			props.allocationType === AllocationTypes.unfilledAllocation &&
			props.shouldUseTagColor &&
			!!props.tagColor
		) {
			return `3px solid ${props.tagColor}`;
		}
		if (props.isGap || props.allocationType === AllocationTypes.unfilledAllocation)
			return "1px solid #FF1500";

		if (props.shouldUseTagColor && !!props.tagColor) {
			return `3px solid ${props.tagColor}`;
		} else {
			const hexBorderColor = getTextColorFromCustomBackgroundColor(props.stage?.color);
			const rgb = hexToRgb(hexBorderColor);

			if (!rgb) return `1px solid rgba(33, 76, 226, 0.6)`;
			return `1px solid rgba(${Object.values(rgb).join(", ")}, 0.6)`;
		}
	}};
	border-style: ${(props) => (props.isGap ? "dashed" : "solid")};

	.name-display {
		color: ${(props) => {
			if (props.isGap || props.allocationType === AllocationTypes.unfilledAllocation)
				return "#FF1500";
			return getTextColorFromCustomBackgroundColor(props.stage?.color);
		}};
	}

	@media print {
		-webkit-print-color-adjust: exact;
		color-adjust: exact;
	}

	:hover {
		opacity: 0.7;
	}
`;

const AllocationBar = styled.div`
	display: flex;
	align-items: center;
	overflow: hidden;

	@media print {
		-webkit-print-color-adjust: exact;
		color-adjust: exact;
	}
`;

const BarText = styled.div`
	font-size: 0.9rem;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const ProjectNameDisplay = styled.span`
	font-weight: 500;
	margin-right: 15px;
	white-space: nowrap;
`;

const DateRangeDisplay = styled.span<{ stage: Stage; allocationType?: AllocationType }>`
	${(p) => {
		if (!p.stage?.color || p.allocationType === AllocationTypes.unfilledAllocation)
			return `color: #7d85a7;`;
		const color = getSecondaryTextColorFromCustomBackGroundColor(p?.stage?.color);
		return `color: ${color};`;
	}}
	min-width: 200px;
`;

function getInterval(date: Date, intervalType: IntervalType = "Weeks"): number {
	const today = new Date();

	if (
		today.getDate() === date.getDate() &&
		today.getMonth() === date.getMonth() &&
		today.getFullYear() === date.getFullYear()
	) {
		return 0;
	}

	const timeDiff = date.getTime() - today.getTime();
	let intervalAmount = 0;
	if (intervalType === "Weeks") {
		intervalAmount = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)); // Calculate the number of weeks
	} else if (intervalType === "Months") {
		const monthsDiff =
			(date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth()); // Calculate the number of months
		intervalAmount = Math.floor(monthsDiff);
	} else if (intervalType === "Quarters") {
		const quartersDiff =
			(date.getFullYear() - today.getFullYear()) * 4 +
			Math.floor((date.getMonth() - today.getMonth()) / 3); // Calculate the number of quarters
		intervalAmount = Math.floor(quartersDiff);
	}
	return intervalAmount;
}

const Marker = ({ date, name }: { date: string; name: string }) => {
	const filters = useSelector(selectStaffViewFilters);

	const milestoneMargin =
		date && getInterval(new Date(date), filters.intervalType) * COLUMN_WIDTH;

	const tooltipTargetId = `tooltip-${name}`;

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
					transform: "translate(-6px,-3.3rem)",
					position: "absolute",
					cursor: "pointer",
				}}
				data-pr-tooltip={name}
				data-pr-position="right"
				data-pr-at="right+5 top"
				data-pr-my="left center-2"
			>
				<div className="pi pi-star"></div>
			</div>
		</>
	);
};
