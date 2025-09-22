import { Button } from "@thekeytechnology/framework-react-components";
import moment from "moment-timezone";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { readInlineData, useFragment } from "react-relay";
import { DEFAULT_CUC_FIELD_MARKERS } from "@components/cuc-field/cuc-field.consts";
import { convertCUCToMarkerInputs } from "@components/cuc-field/cuc-field.utils";
import { FormCucTemplateSelect } from "@components/form/form-cuc-template-select";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import { type SyncAssignmentsCucFormState } from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form";
import {
	YELLOW_BACKGROUND_COLOR,
	YELLOW_BORDER_COLOR,
} from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.consts";
import { type SyncAssignmentWithCucInput } from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.types";
import {
	SelectCucTemplateForm,
	type selectCucTemplateFormSchema,
} from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/select-cuc-template-form";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButton } from "@components/ui/TkButton";
import { type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { type formField_ProjectInScenarioFragment$key } from "@relay/formField_ProjectInScenarioFragment.graphql";
import { CucPreview } from "@screens/cuc-templates/parts/cuc-preview";
import { type FormFactoryFormState } from "@utils/form-factory";
import { withoutEventPropagation } from "@utils/table.utils";
import { PROJECT_IN_SCENARIO_FRAGMENT } from "./form-field.graphql";

export const FormField = ({
	initialValuesWithDefaultCucTemplates,
	initialValues,
	projectInScenarioFragmentRef,
	...props
}: ValidatedFieldConfig<SyncAssignmentWithCucInput[]> & {
	projectInScenarioFragmentRef: formField_ProjectInScenarioFragment$key;
	initialValues?: SyncAssignmentsCucFormState;
	initialValuesWithDefaultCucTemplates: SyncAssignmentWithCucInput[];
}) => {
	const projectInScenarioFragment = useFragment<formField_ProjectInScenarioFragment$key>(
		PROJECT_IN_SCENARIO_FRAGMENT,
		projectInScenarioFragmentRef,
	);
	const getAssignmentForId = (id: string) =>
		projectInScenarioFragment.assignments.edges?.find((e) => e?.node.id === id)?.node;
	const entities = props.fieldValue ?? [];
	const entitiesWithAssignment = entities.map((entity) => ({
		entity,
		assignment: getAssignmentForId(entity.assignmentId),
	}));
	type RowType = (typeof entitiesWithAssignment)[number];

	const setShouldSyncForIds = (ids: string[]) => {
		const items = entities.map(
			(e) =>
				({
					...e,
					shouldSync: ids.includes(e.assignmentId),
				}) as SyncAssignmentWithCucInput,
		);
		props.updateField(items);
	};
	const setCucTemplateRefForIds = (ids: string[], cucTemplateRef?: string) => {
		const items = entities.map(
			(e) =>
				({
					...e,
					cucTemplateRef: ids.includes(e.assignmentId)
						? !cucTemplateRef?.length
							? undefined
							: cucTemplateRef
						: e.cucTemplateRef,
				}) as SyncAssignmentWithCucInput,
		);
		props.updateField(items);
	};
	const [selection, setSelection] = useState<RowType[]>([]);

	const createSelectCuctemplateFormOnSubmitHandler =
		(onHide: () => void) =>
		(values: FormFactoryFormState<typeof selectCucTemplateFormSchema>) => {
			if (!selection.length) {
				onHide();
				return;
			}

			const ids = selection.map((s) => s.entity.assignmentId);

			const items = entities.map(
				(e) =>
					({
						...e,
						shouldSync: false,
						cucTemplateRef: ids.includes(e.assignmentId)
							? values.cucTemplateRef
							: e.cucTemplateRef,
					}) as SyncAssignmentWithCucInput,
			);
			props.updateField(items);
			setSelection([]);
			onHide();
		};

	const handleDefaultOnClick = () => {
		const ids = selection.map((e) => e.entity.assignmentId);
		const idsWithDefaults =
			initialValuesWithDefaultCucTemplates?.map((e) => ({
				assignmentId: e.assignmentId,
				cucTemplateRef: e.cucTemplateRef,
			})) ?? [];

		props.updateField(
			props.fieldValue?.map((e) => {
				if (!ids.includes(e.assignmentId)) return e;
				else
					return {
						...e,
						cucTemplateRef: idsWithDefaults.find(
							(i) => i.assignmentId === e.assignmentId,
						)?.cucTemplateRef,
						shouldSync: false,
					};
			}),
		);
		setSelection([]);
	};
	const [isVisible, setVisible] = useState(false);
	return (
		<>
			<div
				style={{
					display: "flex",
					paddingBottom: "0.5rem",
					gap: "0.5rem",
				}}
			>
				<div>
					<TkButton
						icon="pi pi-sync"
						iconPos="left"
						type={"button"}
						label={"Set cuc template for selection"}
						disabled={selection.length === 0}
						onClick={() => {
							setVisible(true);
						}}
					/>

					<SuspenseDialogWithState<typeof selectCucTemplateFormSchema>
						title={"Set cuc template for selection"}
						isVisible={isVisible}
						affirmativeText={"Apply"}
						onHide={() => {
							setVisible(false);
						}}
						formComponent={(ref, onHide) => (
							<SelectCucTemplateForm
								ref={ref}
								initialValues={{ cucTemplateRef: "" }}
								onSubmit={createSelectCuctemplateFormOnSubmitHandler(onHide)}
							/>
						)}
					/>
				</div>
				<div>
					<Button
						content={{ label: "Set default cuc template for selection" }}
						disabled={selection.length === 0}
						onClick={handleDefaultOnClick}
					/>
				</div>
			</div>
			<DataTable
				value={entitiesWithAssignment}
				removableSort
				tableStyle={{ minWidth: "50rem" }}
				selectionMode={null}
				selection={selection}
				onSelectionChange={(e) => {
					const selectedIds = e.value.map((e) => e.entity.assignmentId);
					setShouldSyncForIds(selectedIds);
					setSelection(e.value);
				}}
				dataKey="entity.assignmentId"
				emptyMessage={"No current or future assignments found."}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
				<Column
					field="assignment.startDate"
					body={(row: RowType) => (
						<span
							style={{
								color: moment(row.assignment?.endDate).isSameOrBefore(moment.now())
									? "darkred"
									: "unset",
							}}
						>
							{row.assignment?.startDate}
						</span>
					)}
					header="Start date"
					sortable
					style={{ width: "25%" }}
				></Column>
				<Column
					body={(row: RowType) => (
						<span
							style={{
								color: moment(row.assignment?.endDate).isSameOrBefore(moment.now())
									? "darkred"
									: "unset",
							}}
						>
							{row.assignment?.endDate}
						</span>
					)}
					field="assignment.endDate"
					header="End date"
					sortable
					style={{ width: "25%" }}
				></Column>
				<Column
					body={(row: RowType) => <span>{row.assignment?.person?.name ?? "Empty"}</span>}
					header="Person"
					style={{ width: "25%" }}
				></Column>
				<Column
					body={(row: RowType) => (
						<span>
							{row.assignment?.validAssignmentRoles?.slice()?.shift()?.name ?? ""}
						</span>
					)}
					header="Assigned role"
					style={{ width: "25%" }}
				></Column>
				<Column
					header={"Current CUC"}
					body={(row: RowType) => {
						const cucDataOpt = row.assignment?.cuc
							? readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
									CUC_INLINE_FRAGMENT,
									row.assignment.cuc,
							  )
							: null;
						const markerInputs = cucDataOpt
							? convertCUCToMarkerInputs(cucDataOpt)!
							: row.assignment?.weight
							? DEFAULT_CUC_FIELD_MARKERS.map((e) => ({
									...e,
									percentageWeight:
										(row.assignment?.weight ?? 1) * 100 ?? e.percentageWeight,
							  }))
							: DEFAULT_CUC_FIELD_MARKERS;

						return (
							<CucPreview
								name={!cucDataOpt ? "CUC - From weight" : undefined}
								cuc={markerInputs}
								backgroundColor={!cucDataOpt ? YELLOW_BACKGROUND_COLOR : undefined}
								borderColor={!cucDataOpt ? YELLOW_BORDER_COLOR : undefined}
							/>
						);
					}}
				/>
				<Column
					header={"Cuc template"}
					body={(row: RowType) => {
						return withoutEventPropagation(
							<FormCucTemplateSelect
								fieldValue={row.entity.cucTemplateRef}
								updateField={(cucTemplateRef) => {
									setCucTemplateRefForIds(
										[row.entity.assignmentId],
										cucTemplateRef ?? "",
									);
								}}
							/>,
						);
					}}
				/>
			</DataTable>
		</>
	);
};
