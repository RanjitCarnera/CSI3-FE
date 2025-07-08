import { CSSProperties } from "react";
import { projectCard_ScenarioFragment$key } from "../../../__generated__/projectCard_ScenarioFragment.graphql";
import { projectCard_ProjectFragment$key } from "../../../__generated__/projectCard_ProjectFragment.graphql";

export interface ProjectCardProps {
	style?: CSSProperties;
	scenarioFragmentRef: projectCard_ScenarioFragment$key;
	projectFragmentRef: projectCard_ProjectFragment$key;
}
