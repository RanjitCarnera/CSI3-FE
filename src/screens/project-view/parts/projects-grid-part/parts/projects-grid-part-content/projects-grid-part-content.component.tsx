import React, { forwardRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment } from "react-relay";
import { AddProjectToScenarioCard } from "@components/relay/add-project-to-scenario-card";
import { ProjectCard } from "@components/relay/project-card/project-card.component";
import { selectScenarioProjectFilters } from "@redux/ProjectViewSlice";
import { type projectsGridPartContent_ProjectInScenarioInlineFragment$key } from "@relay/projectsGridPartContent_ProjectInScenarioInlineFragment.graphql";
import { type projectsGridPartContent_ScenarioFragment$key } from "@relay/projectsGridPartContent_ScenarioFragment.graphql";
import { type projectsGridPartContent_ScenarioRefetchableFragment$key } from "@relay/projectsGridPartContent_ScenarioRefetchableFragment.graphql";
import {
	PROJECT_IN_SCENARIO_INLINE_FRAGMENT,
	SCENARIO_FRAGMENT,
	SCENARIO_REFETCHABLE_FRAGMENT,
} from "./projects-grid-part-content.graphql";

export const ProjectsGridContent = forwardRef(
	(
		{
			scenarioFragmentRef,
		}: {
			scenarioFragmentRef: projectsGridPartContent_ScenarioFragment$key;
		},
		ref,
	) => {
		const scenario = useFragment<projectsGridPartContent_ScenarioFragment$key>(
			SCENARIO_FRAGMENT,
			scenarioFragmentRef,
		);

		const refetchableProjectsData =
			useFragment<projectsGridPartContent_ScenarioRefetchableFragment$key>(
				SCENARIO_REFETCHABLE_FRAGMENT,
				scenario,
			);

		const projects = useMemo(
			() =>
				refetchableProjectsData?.projects?.edges?.map((e) =>
					readInlineData<projectsGridPartContent_ProjectInScenarioInlineFragment$key>(
						PROJECT_IN_SCENARIO_INLINE_FRAGMENT,
						e!.node,
					),
				) ?? [],

			[refetchableProjectsData],
		);

		const projectFilters = useSelector(selectScenarioProjectFilters);

		const projectsToShow = useMemo(
			() =>
				projects
					.sort((x, y) => {
						switch (projectFilters.sorting) {
							case "ByNameAsc":
								return x.project?.name?.localeCompare(y.project.name);
							case "ByNameDesc":
								return -x.project?.name?.localeCompare(y.project.name);
							case "ByStartDateAsc":
								return x.project?.startDate?.localeCompare(y.project.startDate);
							case "ByStartDateDesc":
								return -x.project?.startDate?.localeCompare(y.project.startDate);
							case "ByEndDateAsc":
								return x.project?.endDate?.localeCompare(y.project.endDate);
							case "ByEndDateDesc":
								return -x.project?.endDate?.localeCompare(y.project.endDate);
						}
						return 0;
					})
					.filter(
						(e) =>
							e.project.name
								.toLowerCase()
								.includes(projectFilters.filterByName?.toLowerCase() ?? "") ||
							(e.project.projectIdentifier ?? "")
								.toLowerCase()
								.includes(projectFilters.filterByName?.toLowerCase() ?? ""),
					),
			[projects, projectFilters.sorting, projectFilters.filterByName],
		);

		return (
			<div
				className="flex flex-wrap mt-2 pt-3 overflow-y-scroll to-table-print"
				ref={ref as any}
				key={projectsToShow.toString()}
			>
				{projectsToShow.map((p) => {
					return (
						<ProjectCard
							key={p.id}
							scenarioFragmentRef={scenario}
							projectFragmentRef={p}
						/>
					);
				})}
				<AddProjectToScenarioCard scenarioFragmentRef={scenario} />
			</div>
		);
	},
);
