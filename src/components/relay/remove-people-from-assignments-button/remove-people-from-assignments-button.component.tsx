import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	RemovePeopleFromAssignmentsForm,
	type removePeopleFromAssignmentsFormSchema,
} from "@components/relay/remove-people-from-assignments-button/parts/form.component";
import {
	DELETE_MUTATION,
	UNASSIGN_MUTATION,
} from "@components/relay/remove-people-from-assignments-button/remove-people-from-assignments-button.graphql";
import { type RemovePeopleFromAssignmentsButtonProps } from "@components/relay/remove-people-from-assignments-button/remove-people-from-assignments-button.types";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { useDialogLogic } from "@components/ui/useDialogLogic";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	type removePeopleFromAssignmentsButton_deleteAllAssignmentsFromProjectInScenarioMutation,
	type removePeopleFromAssignmentsButton_deleteAllAssignmentsFromProjectInScenarioMutation$data,
} from "@relay/removePeopleFromAssignmentsButton_deleteAllAssignmentsFromProjectInScenarioMutation.graphql";
import {
	type removePeopleFromAssignmentsButton_DeleteMutation,
	type removePeopleFromAssignmentsButton_DeleteMutation$data,
} from "@relay/removePeopleFromAssignmentsButton_DeleteMutation.graphql";

export const RemovePeopleFromAssignmentsButtonComponent = ({
	scenarioId,
	projectId,
}: RemovePeopleFromAssignmentsButtonProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasProjectEditPermissions = hasPermissions(["UserInAccountPermission_Project_Edit"]);

	const { dialogComponent, showDialog } = useDialogLogic();
	const [doUnassign, isUnAssigning] =
		useMutation<removePeopleFromAssignmentsButton_DeleteMutation>(UNASSIGN_MUTATION);
	const [doDelete, isDeleting] =
		useMutation<removePeopleFromAssignmentsButton_deleteAllAssignmentsFromProjectInScenarioMutation>(
			DELETE_MUTATION,
		);

	const [isVisible, setVisible] = useState(false);

	if (!hasProjectEditPermissions) return <Fragment />;

	return (
		<>
			<TkButtonLink
				icon="pi pi-user-minus"
				iconPos="left"
				label={""}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<typeof removePeopleFromAssignmentsFormSchema>
				title={"Sync assignments' CUC"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<>
							<RemovePeopleFromAssignmentsForm
								ref={ref}
								onSubmit={(values) => {
									const commit = values.shouldDelete ? doDelete : doUnassign;
									commit({
										variables: {
											input: {
												scenarioId,
												projectId,
											},
										},
										onCompleted: (response) => {
											const castedResponse =
												response as removePeopleFromAssignmentsButton_DeleteMutation$data &
													removePeopleFromAssignmentsButton_deleteAllAssignmentsFromProjectInScenarioMutation$data;
											const length =
												(
													castedResponse.Project
														?.unassignAllPeopleFromProject ||
													castedResponse.Project
														?.deleteAllAssignmentsFromProjectInScenario
												)?.assignmentUpdates.length ?? 0;

											onHide();
											const verb = values.shouldDelete
												? "deleted"
												: "cleared";
											toast.success(
												`Successfully ${verb} ${length} assignments.`,
											);
										},
									});
								}}
								initialValues={{
									shouldDelete: false,
								}}
							/>
						</>
					);
				}}
			/>

			{dialogComponent}
		</>
	);
};
