import type { ChartData, ChartOptions } from "chart.js";
import moment from "moment-timezone";
import type { ContextMenu } from "primereact/contextmenu";
import { type MenuItem, type MenuItemCommandEvent } from "primereact/menuitem";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	BACKGROUND_COLOR,
	baseOptions,
	BORDER_COLOR,
} from "@components/cuc-field/cuc-field.consts";
import type { ChartDataValue, MarkerInput } from "@components/cuc-field/cuc-field.types";
import {
	calculateDefaultXMax,
	calculateDefaultXMin,
	calculateDefaultYMax,
	formatDate,
} from "@components/cuc-field/cuc-field.utils";
import {
	type CucFieldContextProviderProps,
	CUCLayer,
	CurrentModalKind,
	type ICucFieldContext,
	type MouseCoords,
	type OnSubmit,
} from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.types";
import {
	createInitialData,
	extractDataFromChartRef,
	getPrevIndex,
} from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.utils";
import { type cucFieldContext_AssignmentFragment$key } from "@relay/cucFieldContext_AssignmentFragment.graphql";
import { type cucFieldContext_GetPercentageForDateOnProjectMutation } from "@relay/cucFieldContext_GetPercentageForDateOnProjectMutation.graphql";
import { type cucFieldContext_ProjectFragment$key } from "@relay/cucFieldContext_ProjectFragment.graphql";
import type { milestoneTemplatesTable_MilestoneTemplateInlineFragment$data } from "@relay/milestoneTemplatesTable_MilestoneTemplateInlineFragment.graphql";
import {
	ASSIGNMENT_FRAGMENT,
	GET_PERCENTAGE_FOR_DATE_ON_PROJECT_MUTATION,
	PROJECT_FRAGMENT,
} from "./cuc-field-context.graphql";

export const CucFieldContext = createContext<ICucFieldContext>({
	mouseCoords: [0, 0],
	setMouseCoords: () => {},
	clickedPointIndex: 0,
	setClickedPointIndex: () => {},
	scaleX: [0, 0],
	setScaleX: () => {},
	scaleY: [0, 0],
	setScaleY: () => {},
	// @ts-expect-error
	chartRef: null,
	// @ts-expect-error
	contextMenuRef: null,
	milestoneTemplates: [],
	setMilestoneTemplates: () => {},
	currentModalKind: null,
	setCurrentModalKind: () => {},
	setOnSubmit: () => {},
	onSubmit: () => {},
	timeMax: 0,
	timeMin: 0,
	weightMax: 0,
	contextMenuItems: [],
	initialData: {
		datasets: [],
		labels: [],
	},
	options: {},
});

/**
 * Handles most of the logic and state management for the CUC field.
 * @param timeMax
 * @param timeMin
 * @param weightMax
 * @param children
 * @param updateField
 * @param fieldValue
 * @param backgroundColor
 * @param borderColor
 * @param dataSetLabel
 * @param endDate
 * @param startDate
 * @param layer Layer1 | Layer3
 * @param projectFragmentRef
 * @param assignmentFragmentRef
 */
export const CucFieldContextProvider = ({
	children,
	timeMin,
	timeMax,
	weightMax,
	updateField,
	fieldValue,
	backgroundColor,
	borderColor,
	dataSetLabel,
	endDate,
	startDate,
	layer,
	projectFragmentRef,
	assignmentFragmentRef,
}: PropsWithChildren<CucFieldContextProviderProps>) => {
	const projectFragmentOpt = useFragment<cucFieldContext_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef ?? null,
	);
	const assignmentFragmentOpt = useFragment<cucFieldContext_AssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		assignmentFragmentRef ?? null,
	);
	const [commitGetPercentageForDate] =
		useMutation<cucFieldContext_GetPercentageForDateOnProjectMutation>(
			GET_PERCENTAGE_FOR_DATE_ON_PROJECT_MUTATION,
		);
	const chartRef = useRef<ChartJSOrUndefined>(null);
	const contextMenuRef = useRef<ContextMenu | null>(null);

	const momentStartDate = startDate ? moment(startDate) : null;
	const momentEndDate = endDate ? moment(endDate) : null;

	const [scaleX, setScaleX] = useState<MouseCoords>([
		calculateDefaultXMin(timeMin),
		calculateDefaultXMax(timeMax),
	]);
	const [scaleY, setScaleY] = useState<MouseCoords>([0, calculateDefaultYMax(weightMax)]);

	const [mouseCoords, setMouseCoords] = useState<MouseCoords>([0, 0]);
	const [clickedPointIndex, setClickedPointIndex] = useState<number | null>(null);

	const isNotStartOrFinish = useMemo(() => {
		const data = extractDataFromChartRef(chartRef);
		if (!data) return true;
		if (Number.isNaN(clickedPointIndex)) return true;

		const selectedMarker = data[clickedPointIndex as number];
		if (!selectedMarker) return true;

		const isStartOrFinish =
			(selectedMarker.kind === "CustomMarker" && selectedMarker.name === "Start") ||
			selectedMarker.name === "Finish";
		return !isStartOrFinish;
	}, [clickedPointIndex, chartRef]);

	const [milestoneTemplateOptions, setMilestoneTemplateOptions] = useState<
		milestoneTemplatesTable_MilestoneTemplateInlineFragment$data[]
	>([]);
	const projectMilestoneOptions = projectFragmentOpt?.milestones ?? [];
	const [currentModalKind, setCurrentModalKind] = useState<null | keyof typeof CurrentModalKind>(
		null,
	);
	const [onSubmit, setOnSubmit] = useState<OnSubmit | null>(null);

	const selectedChartDataValueOpt = useMemo(
		() => extractDataFromChartRef(chartRef)?.[clickedPointIndex ?? 0],
		[chartRef, clickedPointIndex],
	);

	/**
	 * Synchronize formik value with chart data
	 */
	const handleUpdateField = useCallback(
		(markerInput: MarkerInput[] | undefined) => {
			if (!chartRef.current) return;
			updateField(markerInput);
			chartRef.current?.update();
		},
		[updateField],
	);

	const initialData: ChartData<"line", ChartDataValue[]> = useMemo(
		() =>
			createInitialData(
				dataSetLabel ?? "",
				fieldValue ?? [],
				borderColor ?? BORDER_COLOR,
				backgroundColor ?? BACKGROUND_COLOR,
			),
		[dataSetLabel, fieldValue, borderColor, backgroundColor],
	);

	const options: ChartOptions<"line"> = useMemo(
		() => ({
			...baseOptions,
			scales: {
				...baseOptions.scales,
				x: {
					...baseOptions.scales?.x,
					dragData: layer !== CUCLayer.Layer2,
					min: scaleX[0],
					max: scaleX[1],
					ticks: {
						callback: function handleShowStartAndEndDate(tickValue) {
							if (tickValue === 0 && moment.isMoment(momentStartDate)) {
								return formatDate(momentStartDate);
							} else if (tickValue === 100 && moment.isMoment(momentEndDate)) {
								return formatDate(momentEndDate);
							} else return tickValue + "%";
						},
					},
				},
				y: {
					...baseOptions.scales?.y,
					min: scaleY[0],
					max: scaleY[1],
					ticks: {
						callback: (tickValue) => tickValue + "%",
					},
				},
			},
			plugins: {
				...baseOptions.plugins,
				tooltip: {
					callbacks: {
						label: function (context) {
							const y = context.parsed.y;
							const x = context.parsed.x;
							return `Weight: ${y.toFixed(2)}% - Time: ${x.toFixed(2)}%`;
						},
						title: (items) => {
							const data = extractDataFromChartRef(chartRef);
							return items.map((a) => {
								if (!data) return "";
								const item = data[a.dataIndex];
								const ext =
									item.kind === "MilestoneMarker"
										? " - " + formatDate(moment(item.milestoneOpt?.date!))
										: "";
								return !item.name ? "" : `Name: ${item.name}${ext}`;
							});
						},
					},
				},
				dragData: {
					// @ts-expect-error
					...baseOptions.plugins.dragData,
					onDragStart: function handleDisableDragStartFinish(
						e,
						_,
						index,
						value: ChartDataValue,
					) {
						if (value?.name === "Start" || value?.name === "Finish") {
							if (layer === CUCLayer.Layer2) {
								alert("Cannot drag start or finish dates.");
								return false;
							}
							return true;
						}
					},
					onDrag: function (
						e: MouseEvent,
						datasetIndex: number,
						index: number,
						value: ChartDataValue,
					) {
						const data = extractDataFromChartRef(chartRef);
						if (!data) return;
						if (
							value.kind === "CustomMarker" ||
							value.kind === "MilestoneTemplateMarker" ||
							value.kind === "MilestoneMarker"
						) {
							value.x = data[index].x;
						}
					},
					onDragEnd: function (
						e: MouseEvent,
						datasetIndex: number,
						index: number,
						value: ChartDataValue,
					) {
						const dataCopy = extractDataFromChartRef(chartRef);
						if (!dataCopy) return;

						dataCopy[index] = {
							...dataCopy[index],
							x: value.x,
							y: value.y,
							percentageWeight: value.y,
							percentageTime: value.x,
						};

						handleUpdateField(dataCopy);
					},
				},
			},
		}),
		[layer, momentStartDate, momentEndDate, scaleX, scaleY, handleUpdateField],
	);

	const contextMenuItems: MenuItem[] = [
		{
			label: "Add custom point",
			icon: "pi pi-plus",
			visible: ([CUCLayer.Layer3, CUCLayer.Layer1] as Array<keyof typeof CUCLayer>).includes(
				layer,
			),
			command(_: MenuItemCommandEvent) {
				const chart = chartRef.current;
				const canvas = chart?.canvas;
				if (!canvas || !chart) return;

				const rect = canvas.getBoundingClientRect();

				const x = mouseCoords[0] - rect.left;
				const y = mouseCoords[1] - rect.top;

				const xScale = chart.scales.x;
				const yScale = chart.scales.y;

				if (!xScale || !yScale) return;

				const dataX = xScale.getValueForPixel(x) ?? 0;
				const dataY = yScale.getValueForPixel(y) ?? 0;

				const dataset = chart.data.datasets[0];
				const data = dataset.data as ChartDataValue[];

				let insertIndex = 0;

				const xs = data.map((e) => e.x);
				const minX = xs.min() ?? 0;
				const maxX = xs.max() ?? 0;
				if (dataX < minX) {
					insertIndex = 0;
				} else if (dataX > maxX) {
					insertIndex = data.length;
				} else {
					for (let i = 0; i < data.length - 1; i++) {
						const x1 = data[i].x;
						const x2 = data[i + 1].x;
						if (x1 <= dataX && dataX <= x2) {
							insertIndex = i + 1;
							break;
						}
					}
				}

				data.splice(insertIndex, 0, {
					kind: "SimpleMarker",
					x: dataX,
					y: dataY,
					percentageWeight: dataY,
					percentageTime: dataX,
					name: null,
					milestoneTemplateOpt: null,
					milestoneOpt: null,
				});
				handleUpdateField(data);
			},
		},
		{
			label: "Add from milestone template",
			icon: "pi pi-plus",
			visible: layer === CUCLayer.Layer2,
			command(_: MenuItemCommandEvent) {
				const chart = chartRef.current;
				const canvas = chart?.canvas;
				if (!canvas || !chart) return;

				const rect = canvas.getBoundingClientRect();

				const x = mouseCoords[0] - rect.left;
				const y = mouseCoords[1] - rect.top;

				const xScale = chart.scales.x;
				const yScale = chart.scales.y;

				if (!xScale || !yScale) return;

				const dataX = xScale.getValueForPixel(x) ?? 0;
				const dataY = yScale.getValueForPixel(y) ?? 0;

				const dataset = chart.data.datasets[0];
				const data = dataset.data as ChartDataValue[];

				let insertIndex = 0;

				const xs = data.map((e) => e.x);
				const minX = xs.min() ?? 0;
				const maxX = xs.max() ?? 0;
				if (dataX < minX) {
					insertIndex = 0;
				} else if (dataX > maxX) {
					insertIndex = data.length;
				} else {
					for (let i = 0; i < data.length - 1; i++) {
						const x1 = data[i].x;
						const x2 = data[i + 1].x;
						if (x1 <= dataX && dataX <= x2) {
							insertIndex = i + 1;
							break;
						}
					}
				}

				setCurrentModalKind(CurrentModalKind.selectMilestoneTemplate);
				setOnSubmit(() => (id: string) => {
					const opt = milestoneTemplateOptions.find((e) => e.id === id);
					if (!opt) return toast.error("Invalid milestone template selected");

					const data = extractDataFromChartRef(chartRef);
					if (!data) return toast.error("An error occured while reading the chart data.");

					const prevIndex = getPrevIndex(
						[...data],
						(e) => e.percentageTime,
						opt.data.timeInPercent * 100,
					);

					const startIndex = layer === CUCLayer.Layer1 ? prevIndex + 1 : insertIndex;
					data.splice(startIndex, 0, {
						kind: "MilestoneTemplateMarker",
						x: dataX,
						y: dataY,
						percentageWeight: dataY,
						percentageTime: opt.data.timeInPercent * 100,
						name: opt.data.name,
						milestoneTemplateOpt: {
							id,
							name: opt.data.name,
						},
					});
					handleUpdateField(data);
				});
			},
		},
		{
			label: "Set weight",
			icon: "pi pi-chart-bar",
			visible: isNotStartOrFinish && clickedPointIndex !== null,
			command(event: MenuItemCommandEvent) {
				if (clickedPointIndex === null) return;

				setCurrentModalKind(CurrentModalKind.editWeight);
				setOnSubmit(() => (newWeight: number) => {
					initialData.datasets[0].data[clickedPointIndex].percentageWeight = newWeight;
					handleUpdateField(initialData.datasets[0].data);
				});
			},
		},
		{
			label: "Set time",
			icon: "pi pi-clock",
			visible:
				isNotStartOrFinish &&
				([CUCLayer.Layer3, CUCLayer.Layer2] as Array<keyof typeof CUCLayer>).includes(
					layer,
				) &&
				clickedPointIndex !== null &&
				selectedChartDataValueOpt
					? selectedChartDataValueOpt?.kind !== "MilestoneMarker"
					: true,
			command(_: MenuItemCommandEvent) {
				if (clickedPointIndex === null) return;

				setCurrentModalKind(CurrentModalKind.editTime);
				setOnSubmit(() => (newTime: number) => {
					initialData.datasets[0].data[clickedPointIndex].percentageTime = newTime;
					handleUpdateField(initialData.datasets[0].data);
				});
			},
		},
		{
			label: "Delete Point",
			icon: "pi pi-trash",
			visible: isNotStartOrFinish && clickedPointIndex !== null,
			command: () => {
				if (clickedPointIndex !== null) {
					setCurrentModalKind(CurrentModalKind.delete);
					setOnSubmit(() => () => {
						initialData.datasets[0].data.splice(clickedPointIndex, 1);
						setClickedPointIndex(null);
						handleUpdateField(initialData.datasets[0].data);
					});
				}
			},
		},
		{
			label: "Import project milestone",
			icon: "pi pi-file-import",
			visible:
				isNotStartOrFinish &&
				!!startDate &&
				!!endDate &&
				layer === CUCLayer.Layer3 &&
				!!assignmentFragmentOpt &&
				!!projectMilestoneOptions.length,
			command(event: MenuItemCommandEvent) {
				const chart = chartRef.current;
				const canvas = chart?.canvas;
				if (!canvas || !chart) return;

				const rect = canvas.getBoundingClientRect();

				const x = mouseCoords[0] - rect.left;
				const y = mouseCoords[1] - rect.top;

				const xScale = chart.scales.x;
				const yScale = chart.scales.y;

				if (!xScale || !yScale) return;

				const dataX = xScale.getValueForPixel(x) ?? 0;
				const dataY = yScale.getValueForPixel(y) ?? 0;

				const dataset = chart.data.datasets[0];
				const data = dataset.data as ChartDataValue[];

				let insertIndex = 0;

				const xs = data.map((e) => e.x);
				const minX = xs.min() ?? 0;
				const maxX = xs.max() ?? 0;
				if (dataX < minX) {
					insertIndex = 0;
				} else if (dataX > maxX) {
					insertIndex = data.length;
				} else {
					for (let i = 0; i < data.length - 1; i++) {
						const x1 = data[i].x;
						const x2 = data[i + 1].x;
						if (x1 <= dataX && dataX <= x2) {
							insertIndex = i + 1;
							break;
						}
					}
				}

				setCurrentModalKind(CurrentModalKind.importProjectMilestone);
				setOnSubmit(() => (id: string) => {
					const milestoneOpt = projectMilestoneOptions.find((e) => e.id === id);
					if (!milestoneOpt) return toast.error("Invalid project milestone selected");

					if (!projectFragmentOpt) return;
					commitGetPercentageForDate({
						variables: {
							input: {
								mappings: [
									{
										startDate: startDate!,
										endDate: endDate!,
										date: milestoneOpt.data.date,
									},
								],
							},
						},
						onCompleted: (res): undefined => {
							const percentages =
								res.Cuc.getPercentageForDateOnProject?.responses ?? [];

							const response = percentages?.[0];
							const data = extractDataFromChartRef(chartRef);
							if (!data)
								// @ts-expect-error
								return toast.error(
									"An error occured while reading the chart data.",
								);

							if (!response.isGood) {
								toast.warn(
									"Could not import milestone marker. This would lie far outside the current bounds.",
								);
							} else {
								const prevIndex = getPrevIndex(
									[...data],
									(e) => e.percentageTime,
									response.percentage! * 100,
								);

								const startIndex = prevIndex + 1;
								data.splice(startIndex, 0, {
									kind: "MilestoneMarker",
									milestoneOpt: {
										id,
										name: milestoneOpt.data.name,
										date: milestoneOpt.data.date,
										assignmentRef: assignmentFragmentOpt!.id,
									},
									milestoneTemplateOpt: null,
									x: dataX,
									y: dataY,
									percentageWeight: dataY,
									percentageTime: response.percentage! * 100,
									name: milestoneOpt.data.name,
								});
								handleUpdateField(data);
							}
						},
					});
				});
			},
		},
		{
			label: "Sync with project milestone",
			icon: "pi pi-file-import",
			visible:
				isNotStartOrFinish &&
				!!startDate &&
				!!endDate &&
				layer === CUCLayer.Layer3 &&
				!!assignmentFragmentOpt &&
				projectMilestoneOptions.length > 0 &&
				(selectedChartDataValueOpt
					? selectedChartDataValueOpt?.kind !== "MilestoneMarker"
					: true),
			command(event: MenuItemCommandEvent) {
				const chart = chartRef.current;
				const canvas = chart?.canvas;
				if (!canvas || !chart) return;

				setCurrentModalKind(CurrentModalKind.syncProjectMilestone);
				setOnSubmit(() => (id: string) => {
					const milestoneOpt = projectMilestoneOptions.find((e) => e.id === id);
					if (!milestoneOpt) return toast.error("Invalid project milestone selected");

					if (!projectFragmentOpt) return;
					commitGetPercentageForDate({
						variables: {
							input: {
								mappings: [
									{
										startDate: startDate!,
										endDate: endDate!,
										date: milestoneOpt.data.date,
									},
								],
							},
						},
						onCompleted: (res): undefined => {
							const percentages =
								res.Cuc.getPercentageForDateOnProject?.responses ?? [];

							const response = percentages?.[0];
							const data = extractDataFromChartRef(chartRef);
							if (!data)
								// @ts-expect-error
								return toast.error(
									"An error occured while reading the chart data.",
								);

							if (!response.isGood) {
								toast.warn(
									"Could not sync with milestone marker. This would lie far outside the current bounds.",
								);
							} else {
								if (!clickedPointIndex) return;
								const point = data[clickedPointIndex];
								if (!point) return;

								point.kind = "MilestoneMarker";
								point.milestoneOpt = {
									id,
									name: milestoneOpt.data.name,
									date: milestoneOpt.data.date,
									assignmentRef: assignmentFragmentOpt!.id,
								};
								point.x = response.percentage! * 100;
								point.percentageTime = response.percentage! * 100;
								point.name = milestoneOpt.data.name;
								point.milestoneTemplateOpt = null;

								data[clickedPointIndex] = point;
								handleUpdateField(data);
							}
						},
					});
				});
			},
		},
	];

	const value: ICucFieldContext = {
		scaleX,
		setScaleX,
		scaleY,
		setScaleY,
		clickedPointIndex,
		setClickedPointIndex,
		chartRef,
		contextMenuRef,
		currentModalKind,
		setCurrentModalKind,
		onSubmit,
		setOnSubmit,
		mouseCoords,
		setMouseCoords,
		milestoneTemplates: milestoneTemplateOptions,
		setMilestoneTemplates: setMilestoneTemplateOptions,
		timeMax,
		timeMin,
		weightMax,
		contextMenuItems,
		initialData,
		options,
	};

	return <CucFieldContext.Provider value={value}>{children}</CucFieldContext.Provider>;
};
