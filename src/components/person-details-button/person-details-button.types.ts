import { type ReactNode } from "react";
import { type personDetailsButton_PersonFragment$key } from "@relay/personDetailsButton_PersonFragment.graphql";
import { type personDetailsButton_ScenarioFragment$key } from "@relay/personDetailsButton_ScenarioFragment.graphql";
import { type personDetailsButton_ScenarioUtilizationFragment$key } from "@relay/personDetailsButton_ScenarioUtilizationFragment.graphql";

export interface PersonDetailsButtonProps {
	className?: string;
	scenarioFragmentRef: personDetailsButton_ScenarioFragment$key;
	personFragmentRef: personDetailsButton_PersonFragment$key;
	gapDaysOverride?: number;
	afterNameSlot?: ReactNode;
	hideTooltip?: boolean;
	hideGapDays?: boolean;
	variant?: PersonDetailsButtonVariant;
	scenarioUtilizationRef: personDetailsButton_ScenarioUtilizationFragment$key;
}
export enum PersonDetailsButtonVariant {
	roster,
	assignmentCard,
}
