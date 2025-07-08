import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AssignmentsInProject } from "@components/relay/project-card/parts/assignments-in-project/assignments-in-project.component";
import { ProjectMap } from "./ProjectMap.component";
import { type ProjectMapPart_ProjectInScenarioFragment$key } from "../../../__generated__/ProjectMapPart_ProjectInScenarioFragment.graphql";
import { type ProjectMapPart_ScenarioFragment$key } from "../../../__generated__/ProjectMapPart_ScenarioFragment.graphql";
import { TkButtonLink } from "../../../components/ui/TkButtonLink";
import { TkCard } from "../../../components/ui/TkCard";
import { SCENARIO_PROJECT_VIEW_SCREEN_ROUTE } from "../../project-view/ScenarioProjectViewScreen";

const SCENARIO_FRAGMENT = graphql`
	fragment ProjectMapPart_ScenarioFragment on Scenario {
		id
		...assignmentsInProject_ScenarioFragment
	}
`;

const PROJECT_FRAGMENT = graphql`
	fragment ProjectMapPart_ProjectInScenarioFragment on ProjectInScenario {
		project {
			name
		}
		...assignmentsInProject_ProjectFragment
		...ProjectMap_ProjectFragment
	}
`;

interface Props {
	scenarioFragmentRef: ProjectMapPart_ScenarioFragment$key;
	projectFragmentRef: ProjectMapPart_ProjectInScenarioFragment$key;
}

export const ProjectMapPart = ({ scenarioFragmentRef, projectFragmentRef }: Props) => {
	const navigate = useNavigate();

	const scenario = useFragment<ProjectMapPart_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);

	const project = useFragment<ProjectMapPart_ProjectInScenarioFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);

	return (
		<div className="flex flex-column h-full">
			<div className="mb-3">
				<TkCard>
					<div className="flex align-items-center">
						<TkButtonLink
							icon={"pi pi-chevron-left"}
							className="mr-3"
							onClick={() => {
								navigate(
									SCENARIO_PROJECT_VIEW_SCREEN_ROUTE.replace(
										":scenarioId",
										scenario.id,
									),
								);
							}}
						/>
						<Heading className="m-0">{project.project.name}</Heading>
					</div>
				</TkCard>
			</div>
			<div className="flex flex-grow-1">
				<TkCard className="mr-5">
					<Scrollable>
						<AssignmentsInProject
							scenarioFragmentRef={scenario}
							projectFragmentRef={project}
						/>
					</Scrollable>
				</TkCard>

				<ProjectMap className="flex-grow-1" projectRef={project} />
			</div>
		</div>
	);
};

const Scrollable = styled.div`
	height: 100%;
	overflow-y: auto;
	flex-shrink: 0;
`;

const Heading = styled.h2`
	color: var(--text);
	font-size: 1.3rem;
	font-weight: normal;
`;
