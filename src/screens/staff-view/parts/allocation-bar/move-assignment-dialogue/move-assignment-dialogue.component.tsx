import { useFormik } from "formik";
import { type Moment } from "moment-timezone";
import React, { useContext } from "react";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { type MoveAssignmentDialougeProps } from "@screens/staff-view/parts/allocation-bar/move-assignment-dialogue/move-assignment-dialouge.types";
import { type moveAssignmentDialogue_UpdateAssigmentMutation } from "../../../../../__generated__/moveAssignmentDialogue_UpdateAssigmentMutation.graphql";
import { DefaultCalendarComponent } from "../../../../../components/ui/DefaultTextInput";
import { TkButton } from "../../../../../components/ui/TkButton";
import { TkDialog } from "../../../../../components/ui/TkDialog";
import { ValidatedField } from "../../../../../components/ui/ValidatedField";
import { AllocationBarContext, ShowingModalStatus } from "../context/context";
import { UPDATE_ASSIGMENT_MUTATION } from "../resize-assignment-dialogue/resize-assignment-dialogue.graphql";

export const MoveAssignmentDialogue = ({ dates, onSuccess }: MoveAssignmentDialougeProps) => {
	const [updateAssigment, updatingAssigment] =
		useMutation<moveAssignmentDialogue_UpdateAssigmentMutation>(UPDATE_ASSIGMENT_MUTATION);
	const { allocation, laneAllocationIds, setState, oldState, toggleShowingModal } =
		useContext(AllocationBarContext);
	const [startDate, endDate] = [dates?.[0], dates?.[1]];
	const format = (date: Moment) => date.format("YYYY-MM-DD");
	const formik = useFormik<{ startDate: string; endDate: string }>({
		initialValues: {
			startDate: format(startDate),
			endDate: format(endDate),
		},
		onSubmit: (values, formikHelpers) => {
			const { startDate, endDate } = values;

			updateAssigment({
				variables: {
					input: {
						assignmentId: allocation!.assignment!.id,
						data: {
							startDate,
							endDate,
							importId: allocation!.assignment!.importId,
							comment: allocation!.assignment?.comment,
							isExecutive: allocation!.assignment!.isExecutive,
							personRef: allocation!.assignment?.person?.id,
							weight: allocation!.assignment?.weight,
							validAssignmentRolesRef:
								allocation!.assignment?.validAssignmentRoles!.map(
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
					const assigment = config.get(allocation!.assignment!.id);
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

	return (
		<div>
			<TkDialog
				visible={true}
				onHide={() => {
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
