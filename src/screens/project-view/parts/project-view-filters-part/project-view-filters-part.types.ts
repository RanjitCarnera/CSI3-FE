import type { HTMLAttributes } from "react";
import type { projectViewFiltersPart_QueryFragment$key } from "@relay/projectViewFiltersPart_QueryFragment.graphql";
import { type projectViewFiltersPart_ScenarioFragment$key } from "@relay/projectViewFiltersPart_ScenarioFragment.graphql";

export interface ProjectViewFiltersPartProps extends HTMLAttributes<HTMLDivElement> {
	queryRef: projectViewFiltersPart_QueryFragment$key;
	scenarioFragment: projectViewFiltersPart_ScenarioFragment$key;
}
