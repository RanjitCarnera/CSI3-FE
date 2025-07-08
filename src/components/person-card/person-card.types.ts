import { type CSSProperties, type PropsWithChildren } from "react";
import { type personCard_PersonFragment$key } from "@relay/personCard_PersonFragment.graphql";
import { type personCard_ScenarioFragment$key } from "@relay/personCard_ScenarioFragment.graphql";
import { type personCard_ScenarioUtilizationFragment$key } from "@relay/personCard_ScenarioUtilizationFragment.graphql";

export interface PersonCardProps extends PropsWithChildren {
	style?: CSSProperties;
	className?: string;
	scenarioFragmentRef: personCard_ScenarioFragment$key;
	personFragmentRef: personCard_PersonFragment$key;
	gapDaysOverride?: number;
	hideGapDays?: boolean;
	hideTotalVolume?: boolean;
	scenarioUtilizationRef: personCard_ScenarioUtilizationFragment$key;
}

export interface PersonCardSkeletonProps {
	className?: string;
	style?: CSSProperties;
}
