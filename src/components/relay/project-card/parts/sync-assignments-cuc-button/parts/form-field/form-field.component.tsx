import moment from "moment-timezone";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { readInlineData, useFragment } from "react-relay";
import { DEFAULT_CUC_FIELD_MARKERS } from "@components/cuc-field/cuc-field.consts";
import { convertCUCToMarkerInputs } from "@components/cuc-field/cuc-field.utils";
import { FormCucTemplateSelect } from "@components/form/form-cuc-template-select";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import {
	YELLOW_BACKGROUND_COLOR,
	YELLOW_BORDER_COLOR,
} from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.consts";
import { type SyncAssignmentWithCucInput } from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.types";
import { type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { type formField_ProjectInScenarioFragment$key } from "@relay/formField_ProjectInScenarioFragment.graphql";
import { CucPreview } from "@screens/cuc-templates/parts/cuc-preview";
import { withoutEventPropagation } from "@utils/table.utils";
import { PROJECT_IN_SCENARIO_FRAGMENT } from "./form-field.graphql";

export const FormField = (
	props: ValidatedFieldConfig<SyncAssignmentWithCucInput[]> & {
		projectInScenarioFragmentRef: formField_ProjectInScenarioFragment$key;
	},
) => {
	const projectInScenarioFragment = useFragment<formField_ProjectInScenarioFragment$key>(
		PROJECT_IN_SCENARIO_FRAGMENT,
		props.projectInScenarioFragmentRef,
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
	const setCucTemplateRefForId = (id: string, cucTemplateRef?: string) => {
		const items = entities.map(
			(e) =>
				({
					...e,
					cucTemplateRef:
						e.assignmentId === id
							? !cucTemplateRef?.length
								? undefined
								: cucTemplateRef
							: e.cucTemplateRef,
				}) as SyncAssignmentWithCucInput,
		);
		props.updateField(items);
	};
	const [selection, setSelection] = useState<RowType[]>([]);

	return (
		<>
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
									setCucTemplateRefForId(
										row.entity.assignmentId,
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
