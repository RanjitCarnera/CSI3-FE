import moment from "moment-timezone";
import React, { useState } from "react";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { convertMarkerInputsToCUCInput } from "@components/cuc-field/cuc-field.utils";
import {
	SyncAssignmentsCucForm,
	type SyncAssignmentsCucFormState,
} from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form/sync-assignments-cuc-form.component";
import { type SyncAssignmentWithCucInput } from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.types";
import {
	PROJECT_IN_SCENARIO_FRAGMENT,
	SYNC_ASSIGNMENTS_WITH_CUC_MUTATION,
} from "@components/relay/project-card/parts/sync-assignments-cuc-button/sync-assignments-cuc-button.graphql";
import { type SyncAssignmentsCucButtonProps } from "@components/relay/project-card/parts/sync-assignments-cuc-button/sync-assignments-cuc-button.types";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { type syncAssignmentsCucButton_ProjectInScenarioFragment$key } from "@relay/syncAssignmentsCucButton_ProjectInScenarioFragment.graphql";
import {
	type AssignmentSyncCucInstructionInput,
	type syncAssignmentsCucButton_SyncAssignmentsWithCucMutation,
} from "@relay/syncAssignmentsCucButton_SyncAssignmentsWithCucMutation.graphql";

export const SyncAssignmentsCucButton = ({
	projectInScenarioFragmentRef,
}: SyncAssignmentsCucButtonProps) => {
	const projectInScenario = useFragment<syncAssignmentsCucButton_ProjectInScenarioFragment$key>(
		PROJECT_IN_SCENARIO_FRAGMENT,
		projectInScenarioFragmentRef,
	);
	const [commit] = useMutation<syncAssignmentsCucButton_SyncAssignmentsWithCucMutation>(
		SYNC_ASSIGNMENTS_WITH_CUC_MUTATION,
	);
	const [isVisible, setVisible] = useState(false);

	const initialState =
		projectInScenario.assignments.edges
			?.map((e) => e?.node!)
			.filter((node) => {
				const end = moment(node.endDate);
				const today = moment();
				return end.isAfter(today);
			})
			.sort(
				(a, b) =>
					(a.validAssignmentRoles.map((ar) => ar.sortOrder).max() ?? 0) -
					(b.validAssignmentRoles.map((ar) => ar.sortOrder).max() ?? 0),
			)
			.map(
				(e) =>
					({
						assignmentId: e?.id!,
						shouldSync: false,
						cucTemplateRef: undefined,
						cuc: undefined,
					}) as SyncAssignmentWithCucInput,
			) ?? [];
	const initialValuesWithDefaultCucTemplates =
		projectInScenario.assignments.edges
			?.map((e) => e?.node!)
			.filter((node) => {
				const end = moment(node.endDate);
				const today = moment();
				return end.isAfter(today);
			})
			.map(
				(e) =>
					({
						assignmentId: e?.id!,
						shouldSync: false,
						cucTemplateRef: e?.validAssignmentRoles.slice().shift()?.cucTemplate?.id,
						cuc: undefined,
					}) as SyncAssignmentWithCucInput,
			) ?? [];
	return (
		<>
			<TkButtonLink
				icon="pi pi-sync"
				iconPos="left"
				label={""}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<SyncAssignmentsCucFormState>
				title={"Sync assignments' CUC"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<>
							<SyncAssignmentsCucForm
								projectInScenarioFragmentRef={projectInScenario}
								ref={ref}
								initialValuesWithDefaultCucTemplates={
									initialValuesWithDefaultCucTemplates
								}
								onSubmit={(values) => {
									const syncInstructions: AssignmentSyncCucInstructionInput[] =
										values.syncAssignments
											.filter((e) => !!e.cucTemplateRef)
											.map((e) => ({
												assignmentRef: e.assignmentId,
												cucOpt: e.cuc
													? convertMarkerInputsToCUCInput(e.cuc)
													: undefined,
												cucTemplateRefOpt: e.cucTemplateRef,
											}));

									commit({
										variables: {
											input: {
												syncInstructions,
											},
										},
										onCompleted: () => {
											onHide();
											toast.success(
												`Synced ${syncInstructions.length} assignments.`,
											);
										},
									});
								}}
								initialState={{
									syncAssignments: initialState,
								}}
							/>
						</>
					);
				}}
			/>
		</>
	);
};
