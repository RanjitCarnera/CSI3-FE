import { useFormik } from "formik";
import React, { useContext } from "react";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";

import { type ResizeAssignmentDialogueProps } from "@screens/staff-view/parts/allocation-bar/resize-assignment-dialogue/resize-assignment-dialogue.types";
import { UPDATE_ASSIGMENT_MUTATION } from "./resize-assignment-dialogue.graphql";
import { type resizeAssignmentDialogue_UpdateAssigmentMutation } from "../../../../../__generated__/resizeAssignmentDialogue_UpdateAssigmentMutation.graphql";
import { DefaultCalendarComponent } from "../../../../../components/ui/DefaultTextInput";
import { TkButton } from "../../../../../components/ui/TkButton";
import { TkDialog } from "../../../../../components/ui/TkDialog";
import { ValidatedField } from "../../../../../components/ui/ValidatedField";
import { AllocationBarContext } from "../context";
import { ShowingModalStatus } from "../context/context";

export const ResizeAssigmentDialogue = ({ dates, onSuccess }: ResizeAssignmentDialogueProps) => {
	const [updateAssigment, updatingAssigment] =
		useMutation<resizeAssignmentDialogue_UpdateAssigmentMutation>(UPDATE_ASSIGMENT_MUTATION);
	const {
		allocation,
		laneAllocationIds,
		setState,
		setResizedDates,
		oldState,
		toggleShowingModal,
	} = useContext(AllocationBarContext);
	const [startDate, endDate] = [dates?.[0], dates?.[1]];

	const formik = useFormik<{ startDate: string; endDate: string }>({
		initialValues: {
			startDate: startDate.format("YYYY-MM-DD"),
			endDate: endDate.format("YYYY-MM-DD"),
		},
		onSubmit: (values, helpers) => {
			updateAssigment({
				variables: {
					input: {
						assignmentId: allocation?.assignment!.id!,
						data: {
							startDate: values.startDate,
							endDate: values.endDate,
							importId: allocation?.assignment!.importId,
							comment: allocation?.assignment?.comment,
							isExecutive: allocation?.assignment!.isExecutive!,
							personRef: allocation?.assignment?.person?.id,
							weight: allocation?.assignment?.weight,
							validAssignmentRolesRef:
								allocation?.assignment?.validAssignmentRoles!.map(
									(e) => e!.id,
								) as readonly string[],
						},
						setTagsInput: {
							tagsRef: allocation?.assignment?.tags?.map((e) => e.id) ?? [],
							tagNames: [],
						},
					},
				},
				updater: (config) => {
					const assigment = config.get(allocation?.assignment!.id!);
					if (assigment != null) {
						laneAllocationIds.forEach((id) => config.get(id)?.invalidateRecord());
						assigment.invalidateRecord();
						toggleShowingModal(ShowingModalStatus.HIDDEN);
					}
					onSuccess?.();
				},
			});
		},
	});

	if (!allocation) return <React.Fragment />;
	return (
		<div>
			<TkDialog
				visible={true}
				onHide={() => {
					setResizedDates([]);
					setState({ ...oldState });
					toast.warning("Changes discarded.");
					onSuccess?.();
				}}
				header={<div>Assignment Changed</div>}
				footer={
					<TkButton
						disabled={updatingAssigment}
						onClick={() => {
							formik.handleSubmit();
						}}
					>
						Update
					</TkButton>
				}
			>
				<div>
					<ValidatedField
						label={"New Start Date"}
						name={"startDate"}
						formikConfig={formik}
						component={DefaultCalendarComponent}
					/>
				</div>
				<div>
					<ValidatedField
						label={"New End Date"}
						name={"endDate"}
						formikConfig={formik}
						component={DefaultCalendarComponent}
					/>
				</div>
			</TkDialog>
		</div>
	);
};
