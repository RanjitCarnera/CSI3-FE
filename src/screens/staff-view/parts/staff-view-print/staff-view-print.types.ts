import type React from "react";
import { type allocationBarProvider_IntervalFragment$data } from "@relay/allocationBarProvider_IntervalFragment.graphql";
import { type staffViewPart_ScenarioFragment$data } from "@relay/staffViewPart_ScenarioFragment.graphql";
import { type AllocationBarProviderRef } from "@screens/staff-view/parts/allocation-bar/context";

export interface StaffViewPrintProps {
	scenario: staffViewPart_ScenarioFragment$data;
	showSubheaders: boolean;
	cumulativeSubheaderOffset: number;
	allocationBarProviderRef: React.RefObject<AllocationBarProviderRef>;
	intervalDescriptions: allocationBarProvider_IntervalFragment$data[];
	userOffset: number;
	subheadingsOffset: number;
}
