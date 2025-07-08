import type { Point } from "chart.js";
import { type CUCLayer } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.types";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type cucField_AssignmentFragment$key } from "@relay/cucField_AssignmentFragment.graphql";
import { type cucField_ProjectFragment$key } from "@relay/cucField_ProjectFragment.graphql";
import { type MarkerKindEnum } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";

export interface MarkerInput {
	name?: string | null;
	percentageWeight: number;
	percentageTime: number;
	milestoneTemplateOpt?: {
		id: string;
		name: string;
	} | null;
	milestoneOpt?: {
		id: string;
		name: string;
		date: string;
		assignmentRef: string;
	} | null;
	kind: MarkerKindEnum;
}

/**
 * can receive start and endate to display instead of 0 and 100% on x axis.
 */
interface WithProjectDates {
	startDate?: string;
	endDate?: string;
}

export type CUCFieldProps = ValidatedFieldConfig<MarkerInput[]> & {
	dataSetLabel?: string;
	backgroundColor?: string;
	borderColor?: string;
	bottomCap?: number;
	topCap?: number;
	layer: keyof typeof CUCLayer;
	assignmentRoleId?: string;
	projectFragmentRef?: cucField_ProjectFragment$key;
	assignmentFragmentRef?: cucField_AssignmentFragment$key;
} & WithProjectDates;

export type ChartDataValue = MarkerInput & Point;

/**
 * Interface that is exposed to the parent.
 */
export interface CUCFieldRef {
	focus: () => void;
}
