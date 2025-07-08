import debounce from "lodash.debounce";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	readInlineData,
	useLazyLoadQuery,
	useRefetchableFragment,
	useSubscribeToInvalidationState,
} from "react-relay";
import { match } from "ts-pattern";
import { PersonCard } from "@components/person-card";
import { PersonCardBaseStyles } from "@components/person-card/person-card.styles";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import {
	selectShouldUseTagColor,
	selectStaffViewFilters,
	setShouldSeeUseTagColorButton,
} from "@redux/StaffViewSlice";
import { type allocationBarProvider_IntervalFragment$key } from "@relay/allocationBarProvider_IntervalFragment.graphql";
import {
	type staffViewPart_Query,
	type staffViewPart_Query$variables,
} from "@relay/staffViewPart_Query.graphql";
import { type staffViewPart_RefetchQuery } from "@relay/staffViewPart_RefetchQuery.graphql";
import { type staffViewPart_ScenarioFragment$key } from "@relay/staffViewPart_ScenarioFragment.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";
import {
	AllocationBarProvider,
	type AllocationBarProviderRef,
	INTERVAL_FRAGMENT,
} from "@screens/staff-view/parts/allocation-bar/context";
import { AllocationBarComponent } from "@screens/staff-view/parts/AllocationBarComponent";
import { IntervalHeaderComponent } from "@screens/staff-view/parts/IntervalHeaderComponent";
import { StaffViewAllocationType } from "@screens/staff-view/parts/staff-view-part/staff-view-part.consts";
import {
	SCENARIO_FRAGMENT,
	STAFF_VIEW_QUERY,
} from "@screens/staff-view/parts/staff-view-part/staff-view-part.graphql";
import {
	calculateLaneHeight,
	checkIfAnAllocationChainsWithTheNextOne,
} from "@screens/staff-view/parts/staff-view-part/staff-view-part.utils";
import StaffViewPrintComponent from "@screens/staff-view/parts/staff-view-print/staff-view-print.component";
import {
	COLUMN_WIDTH,
	HEADER_MARGIN,
	HEADER_SIZE,
	LANE_HEIGHT,
	MARGIN_BETWEEN_LANES,
	MARGIN_BETWEEN_PEOPLE,
	SIDEBAR_SIZE,
	SUBHEADER_SIZE,
} from "@screens/staff-view/parts/staff-view.utils";
import { useStaffViewUtilizationWindow } from "@utils/use-utilization-window.hook";

interface OwnProps {
	scenarioId: string;
	isPrintViewVisible: boolean;
}

export const StaffViewPart = ({ scenarioId, isPrintViewVisible }: OwnProps) => {
	const dispatch = useDispatch();

	const filters = useSelector(selectStaffViewFilters);
	const shouldSortWithTags = useSelector(selectShouldUseTagColor);
	const utilizationWindow = useStaffViewUtilizationWindow();

	const input: staffViewPart_Query$variables = useMemo(
		() => ({
			id: scenarioId,
			sort: filters.sort,
			showAll: filters.showPast,
			sortWithTags: shouldSortWithTags,
			projectFiltersOpt: {
				ids: filters.filterByProjects?.length ? filters.filterByProjects : undefined,
				divisions: filters.filterByDivisions,
				stages: filters.filterByStages,
				regions: filters.filterByRegions,
				executives: filters.filterByExecutives?.length
					? filters.filterByExecutives
					: undefined,
			},
			personFiltersOpt: {
				executives: filters.filterByExecutives?.length
					? filters.filterByExecutives
					: undefined,
				gapDays: {
					from: filters.filterByGapDaysMinimum,
					to: filters.filterByGapDaysMaximum,
				},
				salary: { from: filters.filterBySalaryMinimum, to: filters.filterBySalaryMaximum },
				assignmentInDateRange: {
					from:
						filters.filterByAssignmentDateMinimum ??
						filters.filterByAllocatedDateMinimum,
					to:
						filters.filterByAssignmentDateMaximum ??
						filters.filterByAllocatedDateMaximum,
				},
				ids: filters.filterByStaff,
				name: filters.filterByPersonName,
				currentlyAssignedAssignmentRoles: filters.filterByCurrentlyAssignedAssignmentRoles,
				jobTitles: filters.filterByAssignmentRoles,
				utilizationStatuses: filters.filterByUtilizationStatus,
				utilizationWindow,
				assignmentTags: applyFilter(filters.filterByAssignmentTags),
				regions: applyFilter(filters.peopleFilterRegion),
				divisions: applyFilter(filters.peopleFilterDivision),
				skillFilters: applyFilter(filters.peopleFilterSkills),
				assignmentStatus: applyFilter(filters.filterByAssignmentStatus),
			},
			intervalType: filters.intervalType || "Weeks",
			utilizationWindow,
		}),
		[scenarioId, filters, shouldSortWithTags],
	);
	const query = useLazyLoadQuery<staffViewPart_Query>(STAFF_VIEW_QUERY, input, {
		fetchPolicy: "network-only",
	});

	const [scenario, refetch] = useRefetchableFragment<
		staffViewPart_RefetchQuery,
		staffViewPart_ScenarioFragment$key
	>(SCENARIO_FRAGMENT, query.node!);

	const [initialLoad, setInitialLoadComplete] = useState(true);

	const debouncedRefetch = () => {
		refetch(input, { fetchPolicy: "network-only" });
	};

	const assigmentIds = scenario.staffView.allocationGroups
		.flatMap((e) => e.allocations)
		.flatMap((e) => e.lanes)
		.flatMap((e) => e?.allocations ?? [])
		.flatMap((e) => e?.assignment?.id) as string[];

	useSubscribeToInvalidationState([...assigmentIds], () => {
		debouncedEventHandler();
	});

	const allocationBarProviderRef = useRef<AllocationBarProviderRef>(null);
	const debouncedEventHandler = useMemo(
		() => {
			const cb = () => {
				debouncedRefetch();
				allocationBarProviderRef.current?.resetPosition();
			};
			return debounce(cb, 1000);
		},
		// eslint-disable-next-line
		[input],
	);

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else if (filters) {
			debouncedEventHandler();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input]);

	let userOffset = HEADER_SIZE + HEADER_MARGIN;

	const showSubheaders = useMemo(
		() =>
			filters.sort === "PositionAsc" ||
			filters.sort === "PositionDesc" ||
			filters.sort === "ProjectAsc" ||
			filters.sort === "ProjectDesc",
		[filters.sort],
	);

	let cumulativeSubheaderOffset = 0;

	const subheadingsOffset = scenario.staffView.allocationGroups.length * SUBHEADER_SIZE;

	const intervalDescriptions = scenario.staffView.intervals.map((e) =>
		readInlineData<allocationBarProvider_IntervalFragment$key>(INTERVAL_FRAGMENT, e),
	);

	const leftHandSide = useMemo(() => {
		return scenario.staffView.allocationGroups.map((allocationGroup) => {
			return allocationGroup.allocations.map((staffViewAllocation, index) => {
				const height = calculateLaneHeight(staffViewAllocation?.lanes?.length ?? 0);
				const person = staffViewAllocation.person;
				const assignmentRole = staffViewAllocation.assignmentRole;
				const showSubheader = showSubheaders && index === 0;

				const heightWithSubheader = height + (showSubheader ? SUBHEADER_SIZE : 0);

				const status = staffViewAllocation.person?.id
					? StaffViewAllocationType.person
					: staffViewAllocation.assignmentRole?.id
					? StaffViewAllocationType.unfilled
					: null;
				const key = match(status)
					.returnType<string>()
					.with(StaffViewAllocationType.person, () => `user-${person?.id ?? index}`)
					.with(
						StaffViewAllocationType.unfilled,
						() => `assignment-role-${assignmentRole?.id ?? index} `,
					)
					.with(null, () => `unknown-${index}`)
					.exhaustive();

				const content = match(status)
					.with(StaffViewAllocationType.person, () => (
						<PersonCard
							className="flex-grow-1 m-0 "
							style={{ height: "100%" }}
							scenarioFragmentRef={scenario}
							personFragmentRef={person!}
							gapDaysOverride={staffViewAllocation.gapDays}
							hideGapDays={allocationGroup.groupType === "project"}
							hideTotalVolume={false}
							scenarioUtilizationRef={scenario.utilizationWithStandAndEndDate}
						/>
					))
					.with(StaffViewAllocationType.unfilled, () => (
						<PersonCardBaseStyles
							style={{ height: "100%" }}
							className="flex-grow-1 m-0 "
						>
							Unassigned
							<div className="roles text-base">
								<div
									key={
										"person" + staffViewAllocation?.assignmentRole?.id + "-role"
									}
									className="role pl-1"
								>
									{staffViewAllocation.assignmentRole?.name}
								</div>
							</div>
						</PersonCardBaseStyles>
					))
					.with(null, () => <Fragment />)
					.exhaustive();

				return (
					<div
						className="flex flex-column"
						key={key}
						style={{
							minHeight: heightWithSubheader,
							maxHeight: heightWithSubheader,
							height: heightWithSubheader,
							marginBottom: MARGIN_BETWEEN_PEOPLE,
						}}
					>
						{showSubheader && (
							<h3
								className="mt-0"
								style={{
									fontSize: 18,
									marginBottom: 5,
								}}
							>
								{allocationGroup.assignmentRole?.name ??
									allocationGroup.project?.name}
							</h3>
						)}
						{content}
					</div>
				);
			});
		});
	}, [scenario, showSubheaders]);

	const cu = useSelector(selectCurrentUser);
	const hideUtilzationWindowHighlighting =
		cu?.user.extension.utilizationDisplay === "UtilizationToday" &&
		!filters.endDate &&
		!filters.startDate;

	const tags = useMemo(
		() =>
			scenario.staffView.allocationGroups
				.flatMap((e) => e.allocations.flatMap((e) => e.lanes.flatMap((e) => e.allocations)))
				.flatMap((e) => e.assignment?.tags),
		[scenario.staffView.allocationGroups],
	);
	const hasTags = !!tags.length;

	useEffect(() => {
		dispatch(setShouldSeeUseTagColorButton(hasTags));
	}, [hasTags]);

	return scenario.staffView.allocationGroups.length === 0 ? (
		<div>
			There are no assignments that match the filter criteria. Add assignments to your
			scenario or change the filters.
		</div>
	) : (
		<div className="relative overflow-auto h-full">
			{isPrintViewVisible ? (
				<StaffViewPrintComponent
					scenario={scenario}
					showSubheaders={showSubheaders}
					cumulativeSubheaderOffset={cumulativeSubheaderOffset}
					allocationBarProviderRef={allocationBarProviderRef}
					intervalDescriptions={intervalDescriptions}
					userOffset={userOffset}
					subheadingsOffset={subheadingsOffset}
				/>
			) : (
				<div className="h-full overflow-scroll relative">
					<div className="sticky top-0 w-max z-5 bg-white flex">
						<div
							className="flex align-items-start"
							style={{ width: SIDEBAR_SIZE, paddingRight: 20 }}
						></div>
						<div className="flex">
							{scenario.staffView.intervals.map((interval) => {
								return (
									<IntervalHeaderComponent
										key={"header-" + interval.index}
										intervalFragmentRef={interval}
									/>
								);
							})}
						</div>
					</div>

					<div
						className="sticky left-0 z-4 bg-white"
						style={{
							width: SIDEBAR_SIZE,
							paddingRight: 20,
							paddingTop: HEADER_MARGIN,
						}}
					>
						{leftHandSide}
					</div>

					<div
						className="absolute top-0 left-0 z-0"
						style={{
							paddingLeft: SIDEBAR_SIZE + 25,
						}}
					>
						<div className="relative bg-white">
							{scenario.staffView.allocationGroups.map((allocationGroup) => {
								return allocationGroup.allocations.map(
									(staffViewAllocation, index) => {
										const showSubheader = showSubheaders && index === 0;
										const subheaderOffset = showSubheader ? SUBHEADER_SIZE : 0;

										cumulativeSubheaderOffset =
											cumulativeSubheaderOffset + subheaderOffset;

										const lanes = staffViewAllocation?.lanes?.flatMap(
											(lane, laneIndex) => {
												const laneTopOffset =
													userOffset +
													cumulativeSubheaderOffset +
													laneIndex *
														(LANE_HEIGHT + MARGIN_BETWEEN_LANES);

												return lane.allocations.map(
													(allocation, allocationIndex) => {
														const isGapAndHideIt =
															allocationGroup.groupType ===
																"project" &&
															allocation.assignment?.id === undefined;

														return isGapAndHideIt ? null : (
															<AllocationBarProvider
																key={
																	(staffViewAllocation.person
																		?.id ?? "unknown") +
																	"-lane-" +
																	laneIndex +
																	"-allocation-" +
																	allocationIndex +
																	"-provider"
																}
																ref={allocationBarProviderRef}
																laneAllocationFragmentRef={
																	allocation
																}
																laneAllocationIds={lane.allocations.map(
																	(a) => a.id,
																)}
																intervalDescriptions={
																	intervalDescriptions
																}
																scenarioFragmentRef={scenario}
																doesChainWithTheNextBar={checkIfAnAllocationChainsWithTheNextOne(
																	allocation,
																	lane.allocations[
																		allocationIndex + 1
																	],
																)}
															>
																<AllocationBarComponent
																	key={
																		(staffViewAllocation.person
																			?.id ??
																			(staffViewAllocation
																				?.assignmentRole
																				?.id ?? "") +
																				index) +
																		"-lane-" +
																		laneIndex +
																		"-allocation-" +
																		allocationIndex
																	}
																	allocationType={
																		staffViewAllocation.person
																			?.id
																			? "personAllocation"
																			: staffViewAllocation
																					.assignmentRole
																					?.id
																			? "unfilledAllocation"
																			: undefined
																	}
																	topOffset={laneTopOffset}
																/>
															</AllocationBarProvider>
														);
													},
												);
											},
										);

										const allLanesHeight = calculateLaneHeight(
											staffViewAllocation?.lanes?.length ?? 0,
										);

										userOffset =
											userOffset + allLanesHeight + MARGIN_BETWEEN_PEOPLE;

										return lanes;
									},
								);
							})}

							{intervalDescriptions.map((interval, index) => {
								return (
									<div
										className="z-5 absolute top-0"
										key={"separator-" + index}
										style={{
											left: index * COLUMN_WIDTH,
											height: userOffset + subheadingsOffset,
											borderLeft: `1px solid #d2d7e1`,
											width: 1,
											...(interval?.fallsIntoCustomUtilizationWindow &&
												!hideUtilzationWindowHighlighting && {
													backgroundColor: "yellow",
													opacity: 0.2,
													width: COLUMN_WIDTH,
													borderLeft: `1px solid #d2d7e1`,
												}),
										}}
									/>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
