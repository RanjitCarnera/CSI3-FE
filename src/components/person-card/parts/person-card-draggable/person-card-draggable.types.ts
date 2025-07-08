import { type PropsWithChildren } from "react";
import { type personCardDraggable_PersonFragment$key } from "@relay/personCardDraggable_PersonFragment.graphql";
import { type personCardDraggable_ScenarioFragment$key } from "@relay/personCardDraggable_ScenarioFragment.graphql";

export interface PersonCardDraggableProps extends PropsWithChildren {
	scenarioFragmentRef: personCardDraggable_ScenarioFragment$key;
	personFragmentRef: personCardDraggable_PersonFragment$key;
	hideTotalVolume?: boolean;
}

export interface DragProps {
	isDragging: boolean;
}

export interface PersonDragItem {
	id: string;
	assignmentRoleId?: string;
}
