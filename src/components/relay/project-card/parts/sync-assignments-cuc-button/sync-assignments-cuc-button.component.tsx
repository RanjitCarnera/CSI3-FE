import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import moment from "moment-timezone";
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

	const initialState =
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
		<FormDialogButton<SyncAssignmentsCucFormState>
			title={"Sync assignments' CUC"}
			buttonContent={{ icon: "pi pi-sync" }}
			buttonVariant={"subtle"}
		>
			{(formRef, onHide) => {
				return (
					<SyncAssignmentsCucForm
						projectInScenarioFragmentRef={projectInScenario}
						ref={formRef}
						onSubmit={(values) => {
							const syncInstructions: AssignmentSyncCucInstructionInput[] =
								values.syncAssignments
									.filter((e) => e.shouldSync)
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
										"Synced " + syncInstructions.length + " assignments.",
									);
								},
							});
						}}
						initialState={{
							syncAssignments: initialState,
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};

// TODO: take a look at AssignmentRoleAssociationField for array form
