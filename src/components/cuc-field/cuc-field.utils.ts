import { type Moment } from "moment-timezone";
import { match } from "ts-pattern";
import { DEFAULT_CUC_FIELD_MARKERS, MAX } from "@components/cuc-field/cuc-field.consts";
import { type MarkerInput } from "@components/cuc-field/cuc-field.types";
import { type CUCInput } from "@relay/CreateAssignmentButton_CreateMutation.graphql";
import { type EditAssignmentButton_CUCInlineFragment$data } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { type MarkerInterfaceInput } from "@relay/EditAssignmentButton_SetAssignmentCUCMutation.graphql";
import { deepCompare } from "@utils/deep-compare";

/**
 * Converts marker inputs to CUCInput.
 * Used when committing graphql mutation.
 * @param markerInputs marker inputs
 * @returns CUCInput | null
 */
export const convertMarkerInputsToCUCInput = (
	markerInputs: undefined | MarkerInput[] | null,
): CUCInput | null => {
	const getPercentage = (num?: number) => (num ?? 100) / 100;
	return markerInputs
		? {
				markers: markerInputs.map((marker) => {
					return match(marker.kind)
						.returnType<MarkerInterfaceInput>()
						.with("SimpleMarker", () => ({
							SimpleMarker: {
								percentageInTime: getPercentage(marker.percentageTime),
								percentageOfWeighting: getPercentage(marker.percentageWeight),
								kind: "SimpleMarker",
							},
						}))
						.with("CustomMarker", () => ({
							CustomMarker: {
								name: marker.name!,
								percentageInTime: getPercentage(marker.percentageTime),
								percentageOfWeighting: getPercentage(marker.percentageWeight),
								kind: "CustomMarker",
							},
						}))
						.with("MilestoneMarker", () => ({
							MilestoneMarker: {
								percentageOfWeighting: getPercentage(marker.percentageWeight),
								milestoneRef: marker.milestoneOpt?.id!,
								assignmentRef: marker.milestoneOpt?.assignmentRef!,
								kind: "MilestoneMarker",
							},
						}))
						.with("MilestoneTemplateMarker", () => ({
							MilestoneTemplateMarker: {
								percentageInTime: getPercentage(marker.percentageTime),
								percentageOfWeighting: getPercentage(marker.percentageWeight),
								milestoneTemplateRef: marker.milestoneTemplateOpt?.id!,
								kind: "MilestoneTemplateMarker",
							},
						}))
						.exhaustive();
				}),
		  }
		: null;
};

/**
 * Converts CUCInlineFragment to marker inputs.
 * Used when displaying CUC, ie. using <code>CUCField</code>
 * Runs the conversion of decimal to percentage.
 * @param cuc
 */
export const convertCUCToMarkerInputs = (
	cuc: EditAssignmentButton_CUCInlineFragment$data | undefined | null,
): MarkerInput[] | null => {
	if (!cuc) return null;
	return cuc.markers.map((marker) => ({
		name:
			marker.kind === "MilestoneMarker"
				? marker.milestone?.data.name
				: marker.kind === "MilestoneTemplateMarker"
				? marker.milestoneTemplate?.data.name
				: marker.name ?? "",
		milestoneOpt:
			marker.kind === "MilestoneMarker"
				? {
						name: marker.milestone?.data.name!,
						date: marker.milestone?.data.date!,
						assignmentRef: marker.assignmentRef!,
						id: marker.milestone?.id!,
				  }
				: null,
		percentageTime:
			marker.kind === "MilestoneTemplateMarker"
				? (marker.milestoneTemplate?.data.timeInPercent ?? 1) * 100
				: (marker?.percentageInTime ?? 1) * 100,
		percentageWeight: marker.percentageOfWeighting * 100,
		milestoneTemplateOpt:
			marker.kind === "MilestoneTemplateMarker"
				? {
						id: marker.milestoneTemplate?.id!,
						name: marker.milestoneTemplate?.data.name!,
				  }
				: null,
		kind: marker.kind,
	}));
};

/**
 * For formatting start and end dates when given to CUCField
 * @param moment
 */
export const formatDate = (moment: Moment) => {
	return moment.format("MM/DD/YYYY");
};

/**
 * calculates default y max for CUCField
 * @param num
 */
export const calculateDefaultYMax = (num?: number) => {
	const base = 150;
	if (!num) return base;
	const isLarger = num > base;
	const reachedCap = num >= MAX.Y_MAX;
	if (reachedCap) return MAX.Y_MAX;
	else if (isLarger) return num + 25 > MAX.Y_MAX ? MAX.Y_MAX : Math.round(num + 25);
	else return base;
};

/**
 * calculates default x max for x axis for CUCField
 * @param num
 */
export const calculateDefaultXMax = (num?: number) => {
	const base = 100;
	if (!num) return base;
	const isLarger = num > base;
	const reachedCap = num >= MAX.X_MAX;
	if (reachedCap) return MAX.X_MAX;
	else if (isLarger) return num + 25 > MAX.X_MAX ? MAX.X_MAX : Math.round(num + 25);
	else return base;
};

/**
 * calculates default x min for x axis for CUCField
 * @param num
 */
export const calculateDefaultXMin = (num?: number) => {
	const base = 0;
	if (!num) return base;
	const isLarger = num < base;
	const reachedCap = num <= MAX.X_MIN;
	if (reachedCap) return MAX.X_MIN;
	else if (isLarger) return num - 25 < MAX.X_MIN ? MAX.X_MIN : Math.round(num - 25);
	else return base;
};

/**
 * Used when creating a new assignment or editing an existing assignment. Because a virtual CUC is displayed inside the form.
 * Hence we do not want to explicitly set said virtual CUC as the explicit CUC for said assignment.
 * @param a  MarkerInput[] | null
 * @param b  MarkerInput[] | null
 * @returns boolean
 */
export const hasUntouchedCUC = (
	a: MarkerInput[] | null | undefined,
	b: MarkerInput[] | null | undefined,
) => {
	return deepCompare(a, DEFAULT_CUC_FIELD_MARKERS) || deepCompare(a, b);
};

export const getMinAndMaxesForMarkerInputs = (markerInputs: MarkerInput[]) => {
	const timeMax = markerInputs?.map((e) => e?.percentageTime).max() ?? 0;
	const timeMin = markerInputs?.map((e) => e?.percentageTime).min() ?? 0;
	const weightMax = markerInputs.map((e) => e?.percentageWeight).max() ?? 0;
	return { timeMin, timeMax, weightMax };
};
