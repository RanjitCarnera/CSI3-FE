import { Button } from "@thekeytechnology/framework-react-components";
import { ContextMenu } from "primereact/contextmenu";
import React, { useContext, useEffect, useImperativeHandle, useLayoutEffect } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import {
	BACKGROUND_COLOR,
	BORDER_COLOR,
	DEFAULT_CUC_FIELD_MARKERS,
	MAX,
	SHOW_CAPS,
} from "@components/cuc-field/cuc-field.consts";
import {
	ASSIGNMENT_FRAGMENT,
	CUC_TEMPLATE_QUERY,
	PROJECT_FRAGMENT,
} from "@components/cuc-field/cuc-field.graphql";
import {
	type CUCFieldProps,
	type CUCFieldRef,
	type MarkerInput,
} from "@components/cuc-field/cuc-field.types";
import {
	calculateDefaultXMax,
	calculateDefaultXMin,
	calculateDefaultYMax,
	convertCUCToMarkerInputs,
	getMinAndMaxesForMarkerInputs,
} from "@components/cuc-field/cuc-field.utils";
import { ApplyFromCucTemplateForm } from "@components/cuc-field/parts/apply-from-cuc-template-form";
import { type applyFromCucTemplateFormSchema } from "@components/cuc-field/parts/apply-from-cuc-template-form/apply-from-cuc-template-form.consts";
import {
	CucFieldContext,
	CucFieldContextProvider,
} from "@components/cuc-field/parts/cuc-field-context";
import { CurrentModalKind } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.types";
import { EditNameForm } from "@components/cuc-field/parts/edit-name-form";
import { EditTimeForm } from "@components/cuc-field/parts/edit-time-form";
import { EditWeightForm } from "@components/cuc-field/parts/edit-weight-form";
import { SelectMilestoneTemplateForm } from "@components/cuc-field/parts/select-milestone-template-form";
import { createYLinePlugin } from "@components/cuc-field/parts/y-line.plugin";
import { FormCucTemplateSelect } from "@components/form/form-cuc-template-select";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import { Slider } from "@components/slider";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { useDialogLogic } from "@components/ui/useDialogLogic";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type cucField_AssignmentFragment$key } from "@relay/cucField_AssignmentFragment.graphql";
import { type cucField_CucTemplateQuery } from "@relay/cucField_CucTemplateQuery.graphql";
import { type cucField_ProjectFragment$key } from "@relay/cucField_ProjectFragment.graphql";
import type { EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { getMilestoneTemplates } from "@screens/milestone-templates/parts/table/milestone-templates-table.utils";
import { ImportProjectMilestoneMarkerForm } from "./parts/import-project-milestone-marker-form";

export const CUCField = React.forwardRef<CUCFieldRef, CUCFieldProps>((props, ref) => {
	const { timeMax, timeMin, weightMax } = getMinAndMaxesForMarkerInputs(props.fieldValue ?? []);

	const project = useFragment<cucField_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		props.projectFragmentRef ?? null,
	);

	const assignment = useFragment<cucField_AssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		props.assignmentFragmentRef ?? null,
	);

	return (
		<CucFieldContextProvider
			timeMax={timeMax}
			timeMin={timeMin}
			weightMax={weightMax}
			updateField={props.updateField}
			fieldValue={props.fieldValue}
			dataSetLabel={props.dataSetLabel}
			borderColor={props.borderColor ?? BORDER_COLOR}
			backgroundColor={props.backgroundColor ?? BACKGROUND_COLOR}
			endDate={props.endDate}
			startDate={props.startDate}
			layer={props.layer}
			projectFragmentRef={project ?? undefined}
			assignmentFragmentRef={assignment ?? undefined}
		>
			<Base {...props} ref={ref} />
		</CucFieldContextProvider>
	);
});

const Base = React.forwardRef<CUCFieldRef, CUCFieldProps>(
	({ topCap, bottomCap, fieldValue, updateField, projectFragmentRef, layer, ...props }, ref) => {
		const projectFragmentOpt = useFragment<cucField_ProjectFragment$key>(
			PROJECT_FRAGMENT,
			projectFragmentRef ?? null,
		);
		const { dialogComponent, showDialog } = useDialogLogic();
		const env = useRelayEnvironment();
		const {
			chartRef,
			contextMenuRef,
			scaleX,
			scaleY,
			setMouseCoords,
			setClickedPointIndex,
			clickedPointIndex,
			setScaleX,
			setScaleY,
			currentModalKind,
			setCurrentModalKind,
			setMilestoneTemplates,
			onSubmit,
			timeMax,
			timeMin,
			weightMax,
			initialData,
			contextMenuItems,
			options,
		} = useContext(CucFieldContext);

		console.log(
			"contextMenuItems: ",
			contextMenuItems.filter((e) => e.visible).map((e) => e.label),
		);
		useEffect(() => {
			if (currentModalKind !== CurrentModalKind.delete) return;

			if (Number.isNaN(clickedPointIndex)) return;
			if (!fieldValue) return;

			const current = fieldValue[clickedPointIndex as number];
			if (!current) return;

			showDialog({
				title: current.name ? `Delete ${current.name}` : "Delete point",
				content:
					(current.name
						? `Do you really want to delete ${current.name}?`
						: "Do you really want to delete this point?") + `This cannot be undone.`,
				affirmativeText: "Delete",
				negativeText: "Cancel",
				dialogCallback: (result) => {
					if (result === "Accept") {
						onSubmit?.("");
					}
					setCurrentModalKind(null);
				},
			});
		}, [currentModalKind]);

		// bind right click
		useEffect(() => {
			const canvas = chartRef.current?.canvas;
			if (!canvas) return;

			const handleRightClick = (event: MouseEvent) => {
				event.preventDefault();
				const chart = chartRef.current;
				if (!chart) return;

				setMouseCoords([event.clientX, event.clientY]);

				const elements = chart.getElementsAtEventForMode(
					event,
					"nearest",
					{ intersect: true },
					false,
				);

				if (elements.length > 0) {
					const index = elements[0].index;
					setClickedPointIndex(index);

					const datasetIndex = elements[0].datasetIndex;

					const meta = chart.getDatasetMeta(datasetIndex);
					const point = meta.data[index];

					// Calculate distance from mouse to point
					const dx = event.offsetX - point.x;
					const dy = event.offsetY - point.y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					const maxDistance = 30; // pixels - adjust to tolerance
					console.log("distance", distance);
					if (distance > maxDistance) {
						setClickedPointIndex(null);
					} else {
						setClickedPointIndex(index);
					}

					// @ts-expect-error
					contextMenuRef.current?.show(event);
				} else {
					// @ts-expect-error
					contextMenuRef.current?.show(event);
					setClickedPointIndex(null);
				}
			};

			canvas.addEventListener("contextmenu", handleRightClick);
			return () => {
				canvas.removeEventListener("contextmenu", handleRightClick);
				setMouseCoords([0, 0]);
			};
		}, [fieldValue]);

		// bind left click
		useEffect(() => {
			const handleOnClick = (e: MouseEvent) => {
				// @ts-expect-error
				contextMenuRef.current?.hide(e);
			};
			chartRef.current?.canvas.addEventListener("click", handleOnClick);

			setClickedPointIndex(null);
			return () => {
				chartRef.current?.canvas.removeEventListener("click", handleOnClick);
			};
		}, []);

		const handleFocus = (markerInputs: MarkerInput[]) => {
			const { timeMax, timeMin, weightMax } = getMinAndMaxesForMarkerInputs(
				markerInputs ?? [],
			);
			setScaleX([calculateDefaultXMin(timeMin), calculateDefaultXMax(timeMax)]);
			setScaleY([0, calculateDefaultYMax(weightMax)]);
		};

		useImperativeHandle(ref, () => ({
			focus: () => {
				handleFocus(fieldValue ?? []);
			},
		}));

		const hasPermissions = useSelector(selectHasPermissions);
		const hasPermission = hasPermissions(["UserInAccountPermission_MilestoneTemplate_Read"]);

		useLayoutEffect(() => {
			if (!hasPermission) {
				setMilestoneTemplates([]);
				return;
			}
			void getMilestoneTemplates().then((res) => {
				setMilestoneTemplates(res);
			});
		}, []);

		const handleClearOnClick = () => {
			updateField(DEFAULT_CUC_FIELD_MARKERS);
		};

		return (
			<>
				<SuspenseDialogWithState<any, string>
					title={"Select milestone template"}
					isVisible={currentModalKind === CurrentModalKind.selectMilestoneTemplate}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => {
						return (
							<div>
								<SelectMilestoneTemplateForm
									ref={ref}
									initialValues={{ name: "" }}
									onSubmit={(values) => {
										onSubmit?.(values.name);
										onHide();
									}}
									alwaysExcludes={
										(fieldValue
											?.map((e) => e.milestoneTemplateOpt?.id)
											.filter((e) => !!e) as string[]) ?? []
									}
								/>
							</div>
						);
					}}
				/>
				<SuspenseDialogWithState<any, string>
					title={"Select name"}
					isVisible={currentModalKind === CurrentModalKind.createNewFromName}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => {
						return (
							<div>
								<EditNameForm
									ref={ref}
									initialValues={{
										name: "",
									}}
									onSubmit={(values) => {
										onSubmit?.(values.name);
										onHide();
									}}
								/>
							</div>
						);
					}}
				/>
				<SuspenseDialogWithState<any, string>
					title={"Edit name"}
					isVisible={currentModalKind === CurrentModalKind.editName}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => {
						return (
							<div>
								<EditNameForm
									ref={ref}
									initialValues={{
										name:
											fieldValue?.length === 2
												? ""
												: Number.isNaN(clickedPointIndex)
												? ""
												: fieldValue?.[clickedPointIndex ?? 0]?.name ?? "",
									}}
									onSubmit={(values) => {
										onSubmit?.(values.name ?? "");
										onHide();
									}}
								/>
							</div>
						);
					}}
				/>
				<SuspenseDialogWithState<any, string>
					title={"Edit percentage in time"}
					isVisible={currentModalKind === CurrentModalKind.editTime}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => {
						return (
							<div>
								<EditTimeForm
									ref={ref}
									initialValues={{
										timeInPercent:
											fieldValue?.length === 2
												? 1
												: Number.isNaN(clickedPointIndex)
												? 1
												: (fieldValue?.[clickedPointIndex ?? 0]
														?.percentageTime ?? 10000) / 100,
									}}
									onSubmit={(values) => {
										onSubmit?.(values.timeInPercent * 100);
										onHide();
									}}
								/>
							</div>
						);
					}}
				/>
				<SuspenseDialogWithState<any, string>
					title={"Edit percentage in weight"}
					isVisible={currentModalKind === CurrentModalKind.editWeight}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => {
						return (
							<div>
								<EditWeightForm
									ref={ref}
									initialValues={{
										weightInPercent:
											fieldValue?.length === 2
												? 1
												: Number.isNaN(clickedPointIndex)
												? 1
												: (fieldValue?.[clickedPointIndex ?? 0]
														?.percentageWeight ?? 10000) / 100,
									}}
									onSubmit={(values) => {
										onSubmit?.(values.weightInPercent * 100);
										onHide();
									}}
								/>
							</div>
						);
					}}
				/>
				<SuspenseDialogWithState<typeof applyFromCucTemplateFormSchema, string>
					title={"Apply from cuc template"}
					affirmativeText={"Apply"}
					isVisible={currentModalKind === CurrentModalKind.applyFromCucTemplate}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => (
						<ApplyFromCucTemplateForm
							ref={ref}
							// @ts-expect-error
							initialValues={{ cucTemplateRef: undefined }}
							onSubmit={(values) => {
								void fetchQuery<cucField_CucTemplateQuery>(
									env,
									CUC_TEMPLATE_QUERY,
									{ id: values.cucTemplateRef },
									{ fetchPolicy: "network-only" },
								)
									.toPromise()
									.then((res) => {
										if (!res?.node?.cuc) return;
										const cucData =
											readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
												CUC_INLINE_FRAGMENT,
												res?.node?.cuc,
											);
										const markerInputs = convertCUCToMarkerInputs(cucData);
										if (!markerInputs) return;
										updateField(markerInputs);
										handleFocus(markerInputs);
									})
									.finally(() => {
										onHide();
									});
							}}
						/>
					)}
				/>
				<SuspenseDialogWithState<any, string>
					title={"Import from project milestone"}
					isVisible={currentModalKind === CurrentModalKind.importProjectMilestone}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => (
						<ImportProjectMilestoneMarkerForm
							ref={ref}
							// @ts-expect-error
							initialValues={{ milestoneRef: undefined }}
							onSubmit={(values) => {
								onSubmit?.(values.milestoneRef);
								onHide();
							}}
							projectFragmentRef={projectFragmentOpt ?? undefined}
							excludeIds={fieldValue
								?.filter((e) => e.kind === "MilestoneMarker")
								.map((e) => e.milestoneOpt?.id!)}
						/>
					)}
				/>
				<SuspenseDialogWithState<any, string>
					title={"Sync with project milestone"}
					isVisible={currentModalKind === CurrentModalKind.syncProjectMilestone}
					onHide={() => {
						setCurrentModalKind(null);
					}}
					formComponent={(ref, onHide) => (
						<ImportProjectMilestoneMarkerForm
							ref={ref}
							// @ts-expect-error
							initialValues={{ milestoneRef: undefined }}
							onSubmit={(values) => {
								onSubmit?.(values.milestoneRef);
								onHide();
							}}
							projectFragmentRef={projectFragmentOpt ?? undefined}
							excludeIds={fieldValue
								?.filter((e) => e.kind === "MilestoneMarker")
								.map((e) => e.milestoneOpt?.id!)}
						/>
					)}
				/>
				{dialogComponent}

				<ContextMenu
					ref={contextMenuRef}
					model={contextMenuItems}
					style={{ minWidth: "250px" }}
				/>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div style={{ flexGrow: 0 }}>
						<Button
							inputVariant={"subtle"}
							content={{
								icon: "pi pi-trash",
								label: "Reset",
								iconPosition: "left",
							}}
							onClick={() => {
								handleClearOnClick();
							}}
						/>
					</div>

					<FormCucTemplateSelect
						showPreviewButton={false}
						placeholder={"From template..."}
						fieldValue={undefined}
						updateField={(cucTemplateRef) => {
							if (!cucTemplateRef) return;

							void fetchQuery<cucField_CucTemplateQuery>(
								env,
								CUC_TEMPLATE_QUERY,
								{ id: cucTemplateRef },
								{ fetchPolicy: "network-only" },
							)
								.toPromise()
								.then((res) => {
									if (!res?.node?.cuc) return;
									const cucData =
										readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
											CUC_INLINE_FRAGMENT,
											res?.node?.cuc,
										);
									const markerInputs = convertCUCToMarkerInputs(cucData);
									if (!markerInputs) return;
									updateField(markerInputs);
									handleFocus(markerInputs);
								});
						}}
					/>
				</div>
				<div style={{ flex: 1 }}>
					<div style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
						<div style={{ height: "40vh", width: "100%" }}>
							<Line
								options={options}
								data={{ ...initialData }}
								plugins={[
									...(bottomCap && SHOW_CAPS
										? [createYLinePlugin(bottomCap)]
										: []),
									...(topCap && SHOW_CAPS ? [createYLinePlugin(topCap)] : []),
								]}
								// @ts-expect-error
								ref={chartRef}
							/>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "40vh",
								position: "relative",
							}}
						>
							<Slider
								min={MAX.Y_MIN}
								max={MAX.Y_MAX}
								value={scaleY}
								onChange={(e) => {
									setScaleY(e.value as [number, number]);
								}}
								range
								orientation="vertical"
							/>
						</div>
					</div>
					<div>
						<Slider
							min={MAX.X_MIN}
							max={MAX.X_MAX}
							value={scaleX}
							onChange={(e) => {
								setScaleX(e.value as [number, number]);
							}}
							range
						/>
					</div>
				</div>
			</>
		);
	},
);
