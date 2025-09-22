import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { match } from "ts-pattern";
import { PersonCard } from "@components/person-card";
import { PersonCardBaseStyles } from "@components/person-card/person-card.styles";
import { selectShowWeights } from "@redux/StaffViewSlice";
import { AllocationBarComponent } from "@screens/staff-view/parts/allocation-bar/component/allocation-bar.component";
import { AllocationBarProvider } from "@screens/staff-view/parts/allocation-bar/context";
import { IntervalHeaderComponent } from "@screens/staff-view/parts/IntervalHeaderComponent";
import { StaffViewAllocationType } from "@screens/staff-view/parts/staff-view-part/staff-view-part.consts";
import {
	calculateLaneHeight,
	checkIfAnAllocationChainsWithTheNextOne,
} from "@screens/staff-view/parts/staff-view-part/staff-view-part.utils";
import { type StaffViewPrintProps } from "@screens/staff-view/parts/staff-view-print/staff-view-print.types";
import { getAvailableRows } from "@screens/staff-view/parts/staff-view-print/utils/getAvailableRows";
import {
	COLUMN_WIDTH,
	HEADER_MARGIN,
	MARGIN_BETWEEN_PEOPLE,
	SIDEBAR_SIZE,
	SUBHEADER_SIZE,
} from "@screens/staff-view/parts/staff-view.utils";

function chunkArray<T>(arr: readonly T[], size: number): readonly T[][] {
	return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
		arr.slice(i * size, i * size + size),
	);
}

const StaffViewPrintComponent = ({
	scenario,
	showSubheaders,
	cumulativeSubheaderOffset,
	allocationBarProviderRef,
	intervalDescriptions,
	userOffset,
	subheadingsOffset,
}: StaffViewPrintProps) => {
	const availableRows = getAvailableRows("A5", "portrait");
	const showWeight = useSelector(selectShowWeights);
	const sideBarSize = (showWeight ? 2 : 1) * SIDEBAR_SIZE;

	return (
		<div className="h-full overflow-scroll relative">
			<div className="sticky top-0 w-max z-5 bg-white flex">
				<div
					className="flex align-items-start"
					style={{ width: SIDEBAR_SIZE, paddingRight: 20 }}
				>
					<Title>Print Layout</Title>
				</div>
				<div className="flex">
					{scenario.staffView.intervals.map((interval) => (
						<IntervalHeaderComponent
							key={"header-" + interval.index}
							intervalFragmentRef={interval}
						/>
					))}
				</div>
			</div>
			<div
				className="sticky left-0 z-4 bg-white"
				style={{ width: SIDEBAR_SIZE, paddingRight: 20, paddingTop: HEADER_MARGIN }}
			>
				{scenario.staffView.allocationGroups.map((allocationGroup) => {
					return allocationGroup.allocations.map((staffViewAllocation, index) => {
						const assignmentRole = staffViewAllocation.assignmentRole;
						const person = staffViewAllocation.person;
						const showSubheader = showSubheaders && index === 0;

						const status = person?.id
							? StaffViewAllocationType.person
							: assignmentRole?.id
							? StaffViewAllocationType.unfilled
							: null;
						const key = match(status)
							.returnType<string>()
							.with(
								StaffViewAllocationType.person,
								() => `user-${person?.id ?? index}`,
							)
							.with(
								StaffViewAllocationType.unfilled,
								() => `assignment-role-${assignmentRole?.id ?? index}`,
							)
							.with(null, () => `unknown-${index}`)
							.exhaustive();
						const content = match(status)
							.with(StaffViewAllocationType.person, () => (
								<PersonCard
									className="flex-grow-1 m-0"
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
									className="flex-grow-1 m-0"
								>
									Unassigned
									<div className="roles text-base">
										<div
											key={"person" + assignmentRole?.id + "-role"}
											className="role pl-1"
										>
											{assignmentRole?.name}
										</div>
									</div>
								</PersonCardBaseStyles>
							))
							.with(null, () => <Fragment />)
							.exhaustive();

						const laneChunks = chunkArray(staffViewAllocation.lanes, availableRows);

						return laneChunks.map((laneChunk, chunkIndex) => {
							const isFirstChunk = chunkIndex === 0;
							const height = calculateLaneHeight(
								laneChunk.length,
								laneChunk.length > 1,
								showWeight,
							);
							const heightWithSubheader =
								height + (isFirstChunk && showSubheader ? SUBHEADER_SIZE : 0);
							return (
								<PersonAndBarsContainer
									key={`${key}-chunk-${chunkIndex}`}
									isPerson={!!person}
									style={undefined}
								>
									<div
										className={
											laneChunk.length < availableRows
												? "to-inline-block-print"
												: ""
										}
									>
										<CardContainer
											className="flex flex-column"
											style={{
												minHeight: heightWithSubheader,
												maxHeight: heightWithSubheader,
												height: heightWithSubheader,
												marginBottom: MARGIN_BETWEEN_PEOPLE,
											}}
										>
											{isFirstChunk && showSubheader && (
												<div
													className="mt-0"
													style={{
														fontSize: "1rem",
														paddingBottom: "1rem",
														fontWeight: "bold",
														textWrap: "nowrap",
														textOverflow: "ellipsis",
														overflowX: "hidden",
													}}
												>
													{allocationGroup.assignmentRole?.name ??
														allocationGroup.project?.name}
												</div>
											)}
											{isFirstChunk ? (
												content
											) : (
												<PersonCardBaseStyles
													style={{ height: "100%" }}
													className="flex-grow-1 m-0"
												>
													Unassigned
													<div className="roles text-base">
														<div
															key={
																"person" +
																assignmentRole?.id +
																"-role"
															}
															className="role pl-1"
														>
															{assignmentRole?.name}
														</div>
													</div>
												</PersonCardBaseStyles>
											)}
										</CardContainer>
									</div>
									<Bars
										className="absolute top-0 left-0 z-0"
										style={{ paddingLeft: SIDEBAR_SIZE + 23 }}
									>
										<div className="relative top-0 bg-white">
											{laneChunk.flatMap((lane: any, laneIndex: number) =>
												lane.allocations.map(
													(allocation: any, allocationIndex: number) => {
														const isGapAndHideIt =
															allocationGroup.groupType ===
																"project" &&
															allocation.assignment?.id === undefined;
														if (isGapAndHideIt) return null;
														const allocationKey = `${key}-chunk-${chunkIndex}-lane-${laneIndex}-allocation-${allocationIndex}`;
														const allocationType = person?.id
															? "personAllocation"
															: assignmentRole?.id
															? "unfilledAllocation"
															: undefined;
														userOffset =
															userOffset +
															calculateLaneHeight(
																staffViewAllocation?.lanes
																	?.length ?? 0,
																staffViewAllocation.lanes.length >
																	1,
																showWeight,
															) +
															MARGIN_BETWEEN_PEOPLE +
															subheadingsOffset;
														return (
															<NoBreakPrintWrapper
																key={allocationKey}
															>
																<AllocationBarProvider
																	ref={allocationBarProviderRef}
																	laneAllocationFragmentRef={
																		allocation
																	}
																	laneAllocationIds={lane.allocations.map(
																		(a: any) => a.id,
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
																	<AllocationBarWrapper>
																		<AllocationBarComponent
																			allocationType={
																				allocationType
																			}
																			topOffset={
																				(showWeight
																					? 75
																					: 50) *
																				laneIndex
																			}
																		/>
																	</AllocationBarWrapper>
																</AllocationBarProvider>
															</NoBreakPrintWrapper>
														);
													},
												),
											)}
										</div>
									</Bars>
								</PersonAndBarsContainer>
							);
						});
					});
				})}
			</div>

			<div className="absolute top-0 left-0 z-0" style={{ paddingLeft: SIDEBAR_SIZE + 25 }}>
				<div className="relative bg-white">
					{intervalDescriptions.map((interval, index) => {
						return (
							<div>
								<IntervalContainer
									printHeight={userOffset + subheadingsOffset}
									className="z-5 absolute top-0 bottom-0"
									key={"separator-" + index}
									style={{
										left: index * COLUMN_WIDTH,
										borderLeft: `1px solid #d2d7e1`,
										width: 1,
										...(interval?.fallsIntoCustomUtilizationWindow && {
											backgroundColor: "yellow",
											opacity: 0.2,
											width: COLUMN_WIDTH,
											borderLeft: `1px solid #d2d7e1`,
										}),
									}}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

interface CardBarsProps {
	isPerson: boolean;
}

const PersonAndBarsContainer = styled.div<CardBarsProps>`
	position: relative;
	z-index: 1;
	@media print {
		display: table;
		width: 150px;
		margin-bottom: ${(props) => (!props.isPerson ? "30px" : "0")};
		break-inside: avoid !important;
		page-break-inside: avoid !important;
		page-break-before: auto !important;
		page-break-after: auto !important;
	}
`;

const Bars = styled.div`
	position: absolute;
	top: 0;
`;

const CardContainer = styled.div`
	width: 280px;
`;

interface IntervalProps {
	printHeight: number;
}

const IntervalContainer = styled.div<IntervalProps>`
	height: ${(props) => props.printHeight}px;
	@media print {
		height: ${(props) => props.printHeight * 1.3}px !important ;
	}
`;

const Title = styled.div`
	@media print {
		display: none;
	}
`;

const NoBreakPrintWrapper = styled.div`
	@media print {
		break-inside: avoid;
		page-break-inside: avoid;
		page-break-after: auto;
		page-break-before: auto;
	}
`;

const AllocationBarWrapper = styled.div`
	@media print {
		break-inside: avoid;
		page-break-inside: avoid;
		page-break-after: auto;
		page-break-before: auto;
	}
`;

export default StaffViewPrintComponent;
