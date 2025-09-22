import moment from "moment-timezone";
import React, { useContext, useId, useMemo, useState } from "react";
import type { DraggableEventHandler } from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { Rnd, type RndResizeCallback } from "react-rnd";
import { toast } from "react-toastify";
import { Conditional } from "@components/conditional";
import { CurrencyDisplayUtil, formatCurrency } from "@components/ui/CurrencyDisplay";
import { DateDisplay, formatDate } from "@components/ui/DateTimeDisplay";
import { PrintableTooltip } from "@components/ui/PrintableTooltip";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	type AssignmentWeightForInterval,
	selectChangedAssignmentWeightsForIntervals,
	selectShouldUseTagColor,
	selectShowWeights,
	setChangedAssignmentWeightsForInterval,
} from "@redux/StaffViewSlice";
import type { allocationBarProvider_AllocationFragment$data } from "@relay/allocationBarProvider_AllocationFragment.graphql";
import { type IntervalType } from "@relay/staffViewPart_Query.graphql";
import {
	AllocationBar,
	AllocationContainer,
	BarText,
	DateRangeDisplay,
	ProjectNameDisplay,
} from "@screens/staff-view/parts/allocation-bar/component/allocation-bar.styles";
import {
	type AllocationBarProps,
	type Stage,
} from "@screens/staff-view/parts/allocation-bar/component/allocation-bar.types";
import {
	getSecondaryTextColorFromCustomBackGroundColor,
	getTextColorFromCustomBackgroundColor,
} from "@screens/staff-view/parts/allocation-bar/component/allocation-bar.utils";
import { Marker } from "@screens/staff-view/parts/allocation-bar/component/parts/marker.component";
import { SelectIntervalPercentageForm } from "@screens/staff-view/parts/allocation-bar/component/parts/select-interval-percentage-form";
import {
	AllocationBarContext,
	floorToNearestMultipleOfStep,
} from "@screens/staff-view/parts/allocation-bar/context";
import { MoveAssignmentDialogue } from "@screens/staff-view/parts/allocation-bar/move-assignment-dialogue/move-assignment-dialogue.component";
import { ResizeAssigmentDialogue } from "@screens/staff-view/parts/allocation-bar/resize-assignment-dialogue";
import {
	COLUMN_WIDTH,
	LANE_HEIGHT,
	WITH_WEIGHTS_MODIFIER,
} from "@screens/staff-view/parts/staff-view.utils";
import { useAssignmentWeightsForInterval } from "./parts/use-assignment-weights-for-interval.hook";

export const AllocationBarComponent = ({ topOffset, allocationType }: AllocationBarProps) => {
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

	const changedAssignmentsWeightForInterval = useSelector(
		selectChangedAssignmentWeightsForIntervals,
	);

	const showWeights = useSelector(selectShowWeights);
	const laneHeight = LANE_HEIGHT * (showWeights ? WITH_WEIGHTS_MODIFIER : 1);

	const assignmentWeightsForInterval = useAssignmentWeightsForInterval(
		allocation?.assignment?.id,
	);
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	const width = useMemo(
		() =>
			((allocation?.toInterval ?? 0) - (allocation?.fromInterval ?? 0)) * COLUMN_WIDTH +
			(doesChainWithNextBar ? 0 : (allocation?.toIntervalPercentage ?? 1) * COLUMN_WIDTH),
		[allocation],
	);

	const intervalStartOffset = useMemo(
		() => (allocation?.fromIntervalPercentage ?? 0) * COLUMN_WIDTH,
		[allocation],
	);

	const intervalEndOffset = useMemo(
		() => (allocation?.toIntervalPercentage ?? 0) * COLUMN_WIDTH,
		[allocation],
	);

	const widthWithOffsets = useMemo(
		() => width + (intervalEndOffset - intervalStartOffset),
		[allocation],
	);

	const projectNameText =
		allocation?.assignment?.project?.name ??
		`${allocation?.lengthInDays} day${(allocation?.lengthInDays ?? 0) > 1 ? "s" : ""} Gap`;
	const isGapTextAllocationBar = !allocation?.assignment?.project?.name;

	const isGap = allocation?.isGap ?? false;
	const hideBar = !gapDaysEnabled && isGap;

	const project = allocation?.assignment?.project;

	const tagColor = allocation?.assignment?.tags.slice().reduce(
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

	const absoluteLeft = floorToNearestMultipleOfStep(
		(allocation?.fromInterval ?? 0) * COLUMN_WIDTH + intervalStartOffset,
		resizeGrid[0],
	);

	const children = (
		<React.Fragment>
			{!hideBar && (
				<>
					<PrintableTooltip
						content={[
							projectNameText,
							allocation?.assignment?.project.volume
								? `Volume: ${formatCurrency(
										allocation?.assignment?.project.volume,
										CurrencyDisplayUtil.formatter.million,
								  )}`
								: undefined,
							allocation?.assignment
								? `Role(s): ${allocation?.assignment?.validAssignmentRoles
										?.map((va) => va.name)
										.join(", ")}`
								: undefined,
							formatDate(allocation?.startDate),
							formatDate(allocation?.endDate),
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
								: (allocation?.assignment?.project.stage as Stage)
						}
						tagColor={tagColor}
						shouldUseTagColor={shouldUseTagColor}
						id={toolTipTarget}
						showWeights={showWeights}
					>
						<AllocationBar>
							<BarText>
								<ProjectNameDisplay className="name-display">
									{projectNameText}
								</ProjectNameDisplay>
								<DateRangeDisplay
									allocationType={allocationType}
									stage={allocation?.assignment?.project.stage as Stage}
								>
									<DateDisplay value={allocation?.startDate} /> -{" "}
									<DateDisplay value={allocation?.endDate} />
								</DateRangeDisplay>
							</BarText>
						</AllocationBar>
						<Conditional.Root condition={showWeights}>
							<Conditional.Success>
								{assignmentWeightsForInterval
									?.filter((e) => !Number.isNaN(e.weight))
									?.sort((a, b) => a.intervalIndex - b.intervalIndex)
									.map(
										(
											assignmentWeight,
											assignmentWeightIndx,
											assignmentWeightsArr,
										) => {
											return (
												<Percentage
													key={
														assignmentWeight.assignmentRef +
														assignmentWeight.intervalIndex
													}
													allocation={allocation!}
													isUnAssigned={!allocation?.assignment?.person}
													changedAssignmentWeight={changedAssignmentsWeightForInterval?.find(
														(e) =>
															e.assignmentRef ===
																assignmentWeight.assignmentRef &&
															e.intervalIndex ===
																assignmentWeight.intervalIndex,
													)}
													assignmentWeight={assignmentWeight}
													assignmentWeightIndx={assignmentWeightIndx}
													assignmentWeightsArr={assignmentWeightsArr}
													intervalStartOffset={intervalStartOffset}
													onClick={(e) => {
														setSelectedLaneAllocation(e);
													}}
													intervalType={intervalType}
												/>
											);
										},
									)}
							</Conditional.Success>
						</Conditional.Root>
					</AllocationContainer>
				</>
			)}
			{project?.milestones.map((ms, index) => (
				<Marker
					projectName={project?.name}
					allocationFromInterval={allocation?.fromInterval ?? 0}
					allocationToInterval={allocation?.toInterval ?? 0}
					absoluteLeft={absoluteLeft}
					projectId={project?.id!}
					date={ms.data.date}
					name={ms.data.name}
					index={index}
					key={ms.data.name}
				/>
			))}
		</React.Fragment>
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
		if (!allocation) return;

		setOldState({ ...state });
		setState({ ...state, x: data.x, y: data.y });
		void getMovedDates(allocation, data.x / 100, intervalType);
	};

	const onResizeStop: RndResizeCallback = (e, dir, ref, delta, position) => {
		if (!hasEditPermissions) return;
		if (!allocation) return;

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

	const isDisabled = !hasEditPermissions || isGapTextAllocationBar || showWeights;

	const canDragLeft = moment() < moment(allocation?.assignment?.startDate);
	const canDragRight = moment() > moment(allocation?.assignment?.startDate);
	const [selectedLaneAllocation, setSelectedLaneAllocation] =
		useState<AssignmentWeightForInterval | null>(null);
	const dispatch = useDispatch();

	if (!allocation) return <div>Missing Allocation</div>;
	return (
		<>
			<SuspenseDialogWithState<any, string>
				title={"Edit Weighting for Time Period"}
				isVisible={!!selectedLaneAllocation}
				onHide={() => {
					setSelectedLaneAllocation(null);
				}}
				formComponent={(ref, onHide) => (
					<SelectIntervalPercentageForm
						ref={ref}
						// @ts-expect-error
						initialValues={{ number: selectedLaneAllocation?.weight }}
						onSubmit={(values) => {
							const copy = changedAssignmentsWeightForInterval.slice();
							const filtered = copy.filter(
								(e) =>
									e.assignmentRef !== selectedLaneAllocation?.assignmentRef ||
									(e.assignmentRef === selectedLaneAllocation?.assignmentRef &&
										e.intervalIndex !== selectedLaneAllocation?.intervalIndex),
							);
							const newEntry = { ...selectedLaneAllocation!, weight: values.number };
							dispatch(
								setChangedAssignmentWeightsForInterval(filtered.concat([newEntry])),
							);
							onHide();
						}}
					/>
				)}
			/>

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
					height: laneHeight,
					width: widthWithOffsets,
				}}
			>
				{
					<Rnd
						disableDragging={isDisabled}
						size={{ width: state.width, height: laneHeight }}
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

interface PercentageProps {
	intervalStartOffset: number;
	allocation: allocationBarProvider_AllocationFragment$data;
	assignmentWeight: AssignmentWeightForInterval;
	assignmentWeightIndx: number;
	assignmentWeightsArr: AssignmentWeightForInterval[];
	onClick: (_: AssignmentWeightForInterval) => void;
	changedAssignmentWeight?: AssignmentWeightForInterval;
	intervalType: IntervalType;
	isUnAssigned: boolean;
}

const getBaseValue = (assignmentWeight: AssignmentWeightForInterval) =>
	!Number.isNaN(assignmentWeight?.weight) ? assignmentWeight.weight! : 1;
const Percentage = ({
	assignmentWeight,
	assignmentWeightIndx,
	assignmentWeightsArr,
	allocation,
	intervalStartOffset,
	onClick,
	changedAssignmentWeight,
	intervalType,
	isUnAssigned,
}: PercentageProps) => {
	const left = assignmentWeightIndx * COLUMN_WIDTH + 32.5;
	const isLast = assignmentWeightsArr.length - 1 === assignmentWeightIndx;
	const isFirst = assignmentWeightIndx === 0;
	const hasFirstIntervalIncomplete = allocation.fromIntervalPercentage !== 0;
	const hasLastIntervalIncomplete = allocation.toIntervalPercentage !== 0;
	const decimalValue = getBaseValue(changedAssignmentWeight ?? assignmentWeight);
	const formattedValue = Math.round(decimalValue * COLUMN_WIDTH) + "%";

	return (
		<ProjectNameDisplay
			className="name-display"
			onClick={(e) => {
				if (intervalType === "Days") {
					toast.warning("Cannot edit weights for days interval.");
					return;
				}
				onClick(changedAssignmentWeight ?? assignmentWeight);
			}}
			style={{
				cursor: "pointer",
				position: "absolute",
				opacity:
					(hasFirstIntervalIncomplete && isFirst) || (hasLastIntervalIncomplete && isLast)
						? 0
						: 100,
				left: isFirst ? left : left - intervalStartOffset,
				bottom: 0,
				color: changedAssignmentWeight
					? isUnAssigned
						? "indianred"
						: getSecondaryTextColorFromCustomBackGroundColor(
								allocation?.assignment?.project.stage?.color!,
						  )
					: isUnAssigned
					? "red"
					: getTextColorFromCustomBackgroundColor(
							allocation?.assignment?.project.stage?.color!,
					  ),
			}}
		>
			{formattedValue}
		</ProjectNameDisplay>
	);
};
