import type { ChartData, ChartOptions } from "chart.js";
import type { ContextMenu } from "primereact/contextmenu";
import { type MenuItem } from "primereact/menuitem";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { type ChartDataValue, type MarkerInput } from "@components/cuc-field/cuc-field.types";
import { type cucFieldContext_AssignmentFragment$key } from "@relay/cucFieldContext_AssignmentFragment.graphql";
import { type cucFieldContext_ProjectFragment$key } from "@relay/cucFieldContext_ProjectFragment.graphql";
import type { milestoneTemplatesTable_MilestoneTemplateInlineFragment$data } from "@relay/milestoneTemplatesTable_MilestoneTemplateInlineFragment.graphql";

type SetStringOnSubmit = (string: string) => void;
type SetNumberOnSubmit = (number: number) => void;
export type OnSubmit = SetStringOnSubmit & SetNumberOnSubmit;

export type MouseCoords = [number, number];

interface ScaleDefaultsInput {
	/**
	 * value used to determine the current max pan on the x-axis
	 */
	weightMax: number;
	/**
	 * value used to determine the current max pan on the y-axis
	 */
	timeMax: number;
	/**
	 * value used to determine the current min pan on the y-axis
	 */
	timeMin: number;
}

export const CurrentModalKind = {
	createNewFromName: "createNewFromName",
	editName: "editName",
	editWeight: "editWeight",
	editTime: "editTime",
	selectMilestoneTemplate: "selectMilestoneTemplate",
	delete: "delete",
	applyFromCucTemplate: "applyFromCucTemplate",
	importProjectMilestone: "importProjectMilestone",
	syncProjectMilestone: "syncProjectMilestone",
} as const;

export const CUCLayer = {
	Layer1: "Layer1",
	Layer2: "Layer2",
	Layer3: "Layer3",
} as const;

export interface CucFieldContextProviderProps extends ScaleDefaultsInput {
	/**
	 * useFormik#updateField() to update the field.
	 * @param markerInputs
	 */
	updateField: (markerInputs: MarkerInput[] | undefined) => void;
	/**
	 * formik field value
	 */
	fieldValue: MarkerInput[] | undefined;
	/**
	 * optional dataset label (title for the chart)
	 */
	dataSetLabel?: string;
	/**
	 * optional border color for the markers
	 */
	borderColor?: string;
	/**
	 * optional background color for the markers
	 */
	backgroundColor?: string;
	/**
	 * should be used when a speficic start and end date are known (ie. layer 3)
	 */
	startDate?: string;
	/**
	 * should be used when a speficic start and end date are known (ie. layer 3)
	 */
	endDate?: string;
	/**
	 * By default, you can only create markers and link them to current milestone templates. This option bypasses this.
	 */
	layer: keyof typeof CUCLayer;
	/**
	 * Possible projectFragment to gather project milestone data for when importing from milestone.
	 */
	projectFragmentRef?: cucFieldContext_ProjectFragment$key;
	/**
	 * Possible assignmentFragment to gather id for when importing from milestone.
	 */
	assignmentFragmentRef?: cucFieldContext_AssignmentFragment$key;
}

export interface ICucFieldContext extends ScaleDefaultsInput {
	chartRef: MutableRefObject<ChartJSOrUndefined | null>;
	contextMenuRef: MutableRefObject<ContextMenu | null>;

	/**
	 * The coordinates of the mouses cursor on the canvas when right-clicking.
	 * Used to determine closed Marker to edit.
	 */
	mouseCoords: MouseCoords;
	setMouseCoords: Dispatch<SetStateAction<MouseCoords>>;
	/**
	 * The index of the point that was clicked.
	 */
	clickedPointIndex: number | null;
	setClickedPointIndex: Dispatch<SetStateAction<number | null>>;
	/**
	 * Scale of the x-axis. Min and max values.
	 */
	scaleX: MouseCoords;
	setScaleX: Dispatch<SetStateAction<MouseCoords>>;
	/**
	 * Scale of the y-axis. Min and max values.
	 */
	scaleY: MouseCoords;
	setScaleY: Dispatch<SetStateAction<MouseCoords>>;

	/**
	 * All milestone template options. Needed for translations for marker names.
	 */
	milestoneTemplates: milestoneTemplatesTable_MilestoneTemplateInlineFragment$data[];
	setMilestoneTemplates: Dispatch<
		SetStateAction<milestoneTemplatesTable_MilestoneTemplateInlineFragment$data[]>
	>;

	/**
	 * The callback that is run when the form of whatever modal is open is submitted.
	 */
	onSubmit: OnSubmit | null;
	setOnSubmit: Dispatch<SetStateAction<OnSubmit | null>>;

	/**
	 * The modal that is open.
	 */
	currentModalKind: null | keyof typeof CurrentModalKind;
	setCurrentModalKind: Dispatch<SetStateAction<null | keyof typeof CurrentModalKind>>;

	/**
	 *  Context menu items
	 *  */
	contextMenuItems: MenuItem[];
	/**
	 * Initial data to display in the chart.
	 */
	initialData: ChartData<"line", ChartDataValue[]>;
	/**
	 * Line chart options.
	 */
	options: ChartOptions<"line">;
}
