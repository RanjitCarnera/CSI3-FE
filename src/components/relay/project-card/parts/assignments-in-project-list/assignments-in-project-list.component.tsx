import { isArray } from "lodash";
import { Accordion, AccordionTab } from "primereact/accordion";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { AssignmentCard } from "@components/relay/AssignmentCard";
import {
	type AssignmentsInProjectListProps,
	type Tag,
} from "@components/relay/project-card/parts/assignments-in-project-list/assignments-in-project-list.types";
import {
	sortByLargestEndDate,
	sortBySmallestStartDate,
} from "@components/relay/project-card/parts/assignments-in-project-list/assignments-in-project-list.utils";
import { DateDisplay } from "@components/ui/DateTimeDisplay";
import {
	selectAreGroupsExpanded,
	selectIsProjectsExpanded,
	selectIsProjectsGroupedByTags,
	selectScenarioProjectFilters,
	selectSelectedProjectId,
	setAreGroupsExpanded,
} from "@redux/ProjectViewSlice";
import { type assignmentsInProjectList_ProjectFragment$key } from "@relay/assignmentsInProjectList_ProjectFragment.graphql";
import { type assignmentsInProjectList_ScenarioFragment$key } from "@relay/assignmentsInProjectList_ScenarioFragment.graphql";
import { PROJECT_FRAGMENT, SCENARIO_FRAGMENT } from "./assignments-in-project-list.graphql";

export const AssignmentsInProjectList = ({
	assignmentsData,
	projectFragmentRef,
	scenarioFragmentRef,
}: AssignmentsInProjectListProps) => {
	const dispatch = useDispatch();
	const projectFilters = useSelector(selectScenarioProjectFilters);
	const filteredForTags = projectFilters.filterByAssignmentTags;
	const project = useFragment<assignmentsInProjectList_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	const scenario = useFragment<assignmentsInProjectList_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const selectedProjectId = useSelector(selectSelectedProjectId);
	const isProjectSelected = selectedProjectId === project.id;

	const isProjectsExpanded = useSelector(selectIsProjectsExpanded) || isProjectSelected;
	const shouldShowGroupedView = useSelector(selectIsProjectsGroupedByTags) && isProjectsExpanded;
	const areGroupsExpanded = useSelector(selectAreGroupsExpanded);

	const allTags = useMemo(
		() =>
			assignmentsData.flatMap((e) =>
				e.tags.map(
					(tag): Tag => ({
						id: tag.id,
						data: {
							name: tag.data.name,
							sortOrder: tag.data.sortOrder,
							color: tag.data.color,
						},
					}),
				),
			),
		[assignmentsData],
	);
	const distinctHeader = allTags.distinctBy((e) => e.id);
	const sortedTags = distinctHeader.sort((e) => e.data.sortOrder);
	const usedTags = useMemo(
		() =>
			sortedTags.filter((tag) =>
				assignmentsData.some((e) =>
					e.tags.some((tagOnAssignment) => tagOnAssignment.id === tag.id),
				),
			),
		[sortedTags, assignmentsData],
	);
	const assignmentsDataWithoutTags = useMemo(
		() => assignmentsData.filter((e) => e.tags.length === 0),
		[assignmentsData],
	);
	const assignmentsDataOnTags = useMemo(
		() =>
			usedTags
				.map((tag) => {
					const assignmentsForTag = assignmentsData.filter((e) =>
						e.tags.some((tagOnAssignment) => tagOnAssignment.id === tag.id),
					);
					return { tag, assignmentsForTag };
				})
				.filter((tagAndAssignments) => {
					if (!filteredForTags) return true;
					else return filteredForTags.includes(tagAndAssignments.tag.id);
				})
				.sort((a, b) => a.tag.data.sortOrder - b.tag.data.sortOrder),
		[usedTags, assignmentsData],
	);

	const hasUngroupedSection = useMemo(
		() => (assignmentsDataWithoutTags.length ? [0] : []),
		[assignmentsDataWithoutTags],
	);
	const all: any[] = useMemo(
		// @ts-expect-error
		() => hasUngroupedSection.concat(usedTags),
		[hasUngroupedSection, usedTags],
	);
	const [selectedIndeces, setSelectedIndeces] = useState<number[]>(
		areGroupsExpanded ? all.map((_, i) => i) : [],
	);

	useEffect(() => {
		if (areGroupsExpanded === true) {
			setSelectedIndeces(all.map((_, i) => i));
		} else if (areGroupsExpanded === false) {
			setSelectedIndeces([]);
		}
	}, [areGroupsExpanded]);

	const ungroupedTabOpt = useMemo(
		() =>
			assignmentsDataWithoutTags.length ? (
				<AccordionTab header={"Ungrouped"}>
					{assignmentsDataWithoutTags.map((assignment) => {
						return (
							<AssignmentCard
								key={assignment.id}
								scenarioFragmentRef={scenario}
								assignmentFragmentRef={assignment}
							/>
						);
					})}
				</AccordionTab>
			) : null,
		[assignmentsDataWithoutTags, scenario],
	);

	const groupedTabs = useMemo(
		() =>
			assignmentsDataOnTags.map((tagAndAssignmentsData) => {
				const startDate = sortBySmallestStartDate(
					tagAndAssignmentsData.assignmentsForTag ?? [],
				)?.[0]?.startDate;
				const endDate = sortByLargestEndDate(
					tagAndAssignmentsData.assignmentsForTag ?? [],
				)?.[0]?.endDate;
				return (
					<AccordionTab
						header={
							<span className="flex flex-column gap-2 w-full">
								<div className={"flex gap-2 align-items-center"}>
									<span>{tagAndAssignmentsData.tag.data.name}</span>
									<div
										style={{
											width: 15,
											height: 15,
											backgroundColor: tagAndAssignmentsData.tag.data.color,
											borderRadius: "100%",
											border: "1px solid black",
										}}
									/>
								</div>
								<div>
									<DateDisplay value={startDate} /> -{" "}
									<DateDisplay value={endDate} />
								</div>
							</span>
						}
					>
						{tagAndAssignmentsData.assignmentsForTag.map((assignment) => {
							return (
								<AssignmentCard
									key={assignment.id}
									scenarioFragmentRef={scenario}
									assignmentFragmentRef={assignment}
								/>
							);
						})}
					</AccordionTab>
				);
			}),
		[assignmentsDataOnTags, scenario],
	);

	const visibleTabs = useMemo(
		() => (ungroupedTabOpt ? [ungroupedTabOpt].concat(groupedTabs) : groupedTabs),
		[ungroupedTabOpt, groupedTabs],
	);

	if (shouldShowGroupedView)
		return (
			<>
				<Accordion
					multiple
					activeIndex={selectedIndeces}
					onTabChange={(e) => {
						dispatch(setAreGroupsExpanded(undefined));
						setSelectedIndeces(isArray(e.index) ? e.index : []);
					}}
				>
					{visibleTabs}
				</Accordion>
			</>
		);
	else if (isProjectsExpanded)
		return (
			<>
				{assignmentsData.map((assignment) => {
					return (
						<AssignmentCard
							key={assignment.id}
							scenarioFragmentRef={scenario}
							assignmentFragmentRef={assignment}
						/>
					);
				})}
			</>
		);

	return <Fragment />;
};
