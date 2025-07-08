import { Button } from "@thekeytechnology/framework-react-components";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { DELETE_MUTATION } from "@components/relay/remove-people-from-assignments-button/remove-people-from-assignments-button.graphql";
import { type RemovePeopleFromAssignmentsButtonProps } from "@components/relay/remove-people-from-assignments-button/remove-people-from-assignments-button.types";
import { useDialogLogic } from "@components/ui/useDialogLogic";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type removePeopleFromAssignmentsButton_DeleteMutation } from "@relay/removePeopleFromAssignmentsButton_DeleteMutation.graphql";

export const RemovePeopleFromAssignmentsButtonComponent = ({
	scenarioId,
	projectId,
}: RemovePeopleFromAssignmentsButtonProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasProjectEditPermissions = hasPermissions(["UserInAccountPermission_Project_Edit"]);

	const { dialogComponent, showDialog } = useDialogLogic();
	const [doDelete, isDeleting] =
		useMutation<removePeopleFromAssignmentsButton_DeleteMutation>(DELETE_MUTATION);

	if (!hasProjectEditPermissions) return <Fragment />;

	return (
		<>
			<Button
				inputVariant={"subtle"}
				content={{ icon: "pi pi-user-minus" }}
				disabled={isDeleting}
				onClick={() => {
					showDialog({
						title: `Unassign All People from Project Assignments`,
						content:
							"Are you sure you want to remove all people from the project assignments?",
						affirmativeText: "Delete",
						negativeText: "Cancel",
						dialogCallback: (result) => {
							if (result === "Accept") {
								doDelete({
									variables: {
										input: {
											scenarioId,
											projectId,
										},
									},
								});
							}
						},
					});
				}}
			/>
			{dialogComponent}
		</>
	);
};
